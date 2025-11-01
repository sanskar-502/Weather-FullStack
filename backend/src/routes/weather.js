const express = require('express');
const router = express.Router();
const { redis } = require('../config/db');
const axios = require('axios');

const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    let { units } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }
    units = ['metric', 'imperial'].includes(units) ? units : 'metric';

    const cacheKey = `weather:${lat}:${lon}:${units}`;

    if (hasRedis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return res.json(cached);
        }
      } catch (e) {
        console.warn('Redis get failed (continuing without cache):', e?.message || e);
      }
    }

    if (!process.env.OWM_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key (OWM_KEY) is not configured' });
    }

    const weatherUrl = process.env.OPENWEATHER_URL || 'https://api.openweathermap.org/data/2.5/weather';
    const response = await axios.get(weatherUrl, {
      params: {
        lat,
        lon,
        units,
        appid: process.env.OWM_KEY
      }
    });

    const payload = { key: `${lat}_${lon}_${units}`, data: response.data };

    if (hasRedis) {
      try {
        await redis.set(cacheKey, payload, { ex: 60 });
      } catch (e) {
        console.warn('Redis set failed (continuing without cache):', e?.message || e);
      }
    }

    res.json(payload);
  } catch (error) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error('Weather API Error:', data || error.message || error);
    res.status(500).json({ error: data?.message || data?.error || error?.message || 'Failed to fetch weather data' });
  }
});

router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    let { units } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon are required' });
    }
    units = ['metric', 'imperial'].includes(units) ? units : 'metric';

    const cacheKey = `forecast:${lat}:${lon}:${units}`;

    if (hasRedis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return res.json(cached);
        }
      } catch (e) {
        console.warn('Redis get failed (continuing without cache):', e?.message || e);
      }
    }

    if (!process.env.OWM_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key (OWM_KEY) is not configured' });
    }

    const onecallUrl = process.env.OPENWEATHER_ONECALL_URL || 'https://api.openweathermap.org/data/2.5/onecall';

    const fetchOneCall = async () => axios.get(onecallUrl, {
      params: { lat, lon, units, appid: process.env.OWM_KEY, exclude: 'minutely' }
    });

    const transformFiveDay = (raw) => {
      const list = Array.isArray(raw?.list) ? raw.list : [];
      const hourly = list.map((it) => ({
        dt: it.dt,
        temp: it.main?.temp,
        feels_like: it.main?.feels_like,
        pressure: it.main?.pressure,
        humidity: it.main?.humidity,
        visibility: it.visibility,
        clouds: it.clouds?.all,
        wind_speed: it.wind?.speed,
        wind_deg: it.wind?.deg,
        wind_gust: it.wind?.gust,
        pop: it.pop,
        rain: it.rain?.['3h'] ? { '1h': it.rain['3h'] / 3 } : undefined,
        snow: it.snow?.['3h'] ? { '1h': it.snow['3h'] / 3 } : undefined,
        weather: it.weather || []
      }));

      const byDay = new Map();
      hourly.forEach((h) => {
        const d = new Date(h.dt * 1000);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const key = `${year}-${month}-${day}`;
        const arr = byDay.get(key) || [];
        arr.push(h);
        byDay.set(key, arr);
      });

      const daily = Array.from(byDay.values()).map((arr) => {
        const temps = arr.map(a => a.temp).filter(t => typeof t === 'number');
        const min = Math.min(...temps);
        const max = Math.max(...temps);
        const mid = arr[Math.min(Math.floor(arr.length/2), arr.length-1)];
        const firstDate = new Date(arr[0].dt * 1000);
        firstDate.setHours(12, 0, 0, 0);
        const normalizedDt = Math.floor(firstDate.getTime() / 1000);
        
        return {
          dt: normalizedDt,
          temp: { day: mid.temp, min, max, morn: arr[0]?.temp, eve: arr[arr.length-1]?.temp, night: arr[arr.length-1]?.temp },
          feels_like: { day: mid.feels_like, morn: arr[0]?.feels_like, eve: arr[arr.length-1]?.feels_like, night: arr[arr.length-1]?.feels_like },
          pressure: mid.pressure,
          humidity: mid.humidity,
          wind_speed: mid.wind_speed,
          wind_deg: mid.wind_deg,
          weather: mid.weather || [],
          pop: Math.max(...arr.map(a => a.pop || 0))
        };
      });

      return { timezone: raw.city?.timezone, hourly, daily };
    };

    let payload;
    try {
      const response = await fetchOneCall();
      payload = { key: `${lat}_${lon}_${units}_forecast`, data: response.data };
    } catch (err) {
      const status = err?.response?.status;
      const fiveDayUrl = process.env.OPENWEATHER_FIVEDAY_URL || 'https://api.openweathermap.org/data/2.5/forecast';
      if (status === 401 || status === 404 || status === 400) {
        const resp = await axios.get(fiveDayUrl, { params: { lat, lon, units, appid: process.env.OWM_KEY } });
        const transformed = transformFiveDay(resp.data);
        payload = { key: `${lat}_${lon}_${units}_forecast`, data: transformed };
      } else {
        throw err;
      }
    }

    if (hasRedis) {
      try {
        await redis.set(cacheKey, payload, { ex: 60 }); // 60 seconds for real-time data
      } catch (e) {
        console.warn('Redis set failed (continuing without cache):', e?.message || e);
      }
    }

    res.json(payload);
  } catch (error) {
    const data = error?.response?.data;
    console.error('Forecast API Error:', data || error.message || error);
    res.status(500).json({ error: data?.message || data?.error || 'Failed to fetch forecast data' });
  }
});

module.exports = router;
