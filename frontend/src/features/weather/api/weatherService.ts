import api from './apiClient';
import { weatherCacheService } from './weatherCache';
import type { WeatherData } from '../../../types';

export interface WeatherParams {
  lat: number;
  lon: number;
  units?: string;
}

interface RequestContext {
  endpoint: string;
  params: WeatherParams;
  startTime: number;
}

const requestMetrics = {
  totalAttempts: 0,
  successfulRetries: 0,
  failedRequests: 0,
};

const handleRequestError = (err: any, context: RequestContext) => {
  requestMetrics.failedRequests++;
  
  if ((err.config as any)?._retry > 0) {
    requestMetrics.successfulRetries++;
  }

  console.error('Weather request failed:', {
    endpoint: context.endpoint,
    params: context.params,
    error: {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      retryCount: (err.config as any)?._retry || 0
    },
    metrics: requestMetrics
  });

  const message = err?.response?.data?.error || err?.message || `Failed to fetch ${context.endpoint}`;
  throw new Error(message);
};

export interface WeatherService {
  getCurrent(params: WeatherParams): Promise<WeatherData>;
  getForecast(params: WeatherParams): Promise<WeatherData[]>;
}

const inflight = new Map<string, Promise<any>>();
const keyFor = (endpoint: string, { lat, lon, units = 'metric' }: WeatherParams) => `${endpoint}:${lat}:${lon}:${units}`;

export const weatherService: WeatherService = {
  async getCurrent({ lat, lon, units = 'metric' }: WeatherParams): Promise<WeatherData> {
    const startTime = Date.now();
    requestMetrics.totalAttempts++;

    const cachedData = await Promise.resolve(weatherCacheService.getCurrentWeather(lat, lon, units));
    if (cachedData) {
      console.debug('Weather data retrieved from cache:', {
        endpoint: '/weather/current',
        params: { lat, lon, units }
      });
      return cachedData;
    }

    const inflightKey = keyFor('/weather/current', { lat, lon, units });
    if (inflight.has(inflightKey)) {
      return inflight.get(inflightKey) as Promise<WeatherData>;
    }

    const p = (async () => {
      try {
        const response = await api.get<any>('/weather/current', { 
          params: { lat, lon, units }
        });
  
        // Backend may wrap data as { key, data }
        const payload = response.data;
        const data: WeatherData = payload && payload.data ? payload.data : payload;
  
        // Cache the successful response
        weatherCacheService.setCurrentWeather(lat, lon, units, data);
  
        // Log successful request
        const duration = Date.now() - startTime;
        console.debug(`Weather request successful (${duration}ms):`, {
          endpoint: '/weather/current',
          params: { lat, lon, units },
          cacheMetrics: weatherCacheService.getMetrics()
        });
  
        return data;
      } catch (err: unknown) {
        handleRequestError(err, {
          endpoint: '/weather/current',
          params: { lat, lon, units },
          startTime
        });
        throw err; // Re-throw after logging
      } finally {
        inflight.delete(inflightKey);
      }
    })();

    inflight.set(inflightKey, p);
    return p as Promise<WeatherData>;
  },

  async getForecast({ lat, lon, units = 'metric' }: WeatherParams): Promise<WeatherData[]> {
    const startTime = Date.now();
    requestMetrics.totalAttempts++;

    // Try to get from cache first
    const cachedData = await Promise.resolve(weatherCacheService.getForecast(lat, lon, units));
    if (cachedData) {
      console.debug('Forecast data retrieved from cache:', {
        endpoint: '/weather/forecast',
        params: { lat, lon, units }
      });
      return cachedData;
    }

    const inflightKey = keyFor('/weather/forecast', { lat, lon, units });
    if (inflight.has(inflightKey)) {
      return inflight.get(inflightKey) as Promise<WeatherData[]>;
    }

    const p = (async () => {
      try {
        const response = await api.get<any>('/weather/forecast', { 
          params: { lat, lon, units }
        });
  
        // Backend may wrap data as { key, data }
        const payload = response.data;
        const data: WeatherData[] = payload && payload.data ? payload.data : payload;
  
        // Cache the successful response
        weatherCacheService.setForecast(lat, lon, units, data);
  
        // Log successful request
        const duration = Date.now() - startTime;
        console.debug(`Weather forecast request successful (${duration}ms):`, {
          endpoint: '/weather/forecast',
          params: { lat, lon, units },
          cacheMetrics: weatherCacheService.getMetrics()
        });
  
        return data;
      } catch (err: unknown) {
        handleRequestError(err, {
          endpoint: '/weather/forecast',
          params: { lat, lon, units },
          startTime
        });
        throw err; // Re-throw after logging
      } finally {
        inflight.delete(inflightKey);
      }
    })();

    inflight.set(inflightKey, p);
    return p as Promise<WeatherData[]>;
  },
};
