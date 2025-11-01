import React, { useEffect } from 'react';
import { RootState } from '../../../store/store';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCurrentWeather, fetchForecast } from '../weatherSlice';
import { useWeather } from '../context/WeatherContext';
import { useWeatherData } from '../hooks/useWeatherData';
import { TemperatureChart } from './charts/TemperatureChart';
import { PrecipitationChart } from './charts/PrecipitationChart';
import { WindChart } from './charts/WindChart';
import { DailyForecast } from './DailyForecast';

interface WeatherDetailProps {
  cityId: string;
  name: string;
  lat: number;
  lon: number;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({
  cityId,
  name,
  lat,
  lon
}) => {
  const dispatch = useAppDispatch();
  const units = useAppSelector((state: RootState) => state.preferences.units);
  const currentKey = `${lat}_${lon}_${units}`;
  const forecastKey = `${lat}_${lon}_${units}_forecast`;

  const current = useAppSelector((state: RootState) => (state as any).weather?.byId?.[currentKey]?.data);
  const forecast = useAppSelector((state: RootState) => (state as any).weather?.forecastsById?.[forecastKey]?.data);
  const status = useAppSelector((state: RootState) => (state as any).weather?.status);

  useEffect(() => {
    if (!current) {
      dispatch(fetchCurrentWeather({ lat, lon, units }));
    }
    if (!forecast) {
      dispatch(fetchForecast({ lat, lon, units }));
    }
  }, [dispatch, lat, lon, units, current, forecast]);

  if (status === 'loading' && !forecast && !current) {
    return <div className="loading">Loading weather data...</div>;
  }

  const data = forecast || current;
  if (!data) {
    return <div className="error">Failed to load weather data</div>;
  }

  const hourly = Array.isArray((data as any).hourly) ? (data as any).hourly : [];
  const daily = Array.isArray((data as any).daily) ? (data as any).daily : [];

  // Derive a temperature for header from current -> hourly[0] -> daily[0].temp.day
  const headerTempRaw: number | undefined = (current as any)?.current?.temp
    ?? (current as any)?.main?.temp
    ?? (forecast as any)?.current?.temp
    ?? (hourly?.[0]?.temp as number | undefined)
    ?? (daily?.[0]?.temp?.day as number | undefined);
  const tempUnitLabel = units === 'metric' ? 'C' : 'F';
  const headerTempDisplay = typeof headerTempRaw === 'number' ? `${Math.round(headerTempRaw)}°${tempUnitLabel}` : '—';

  const headerCondition = (current as any)?.current?.weather?.[0]?.description
    || (data as any)?.weather?.[0]?.description
    || (hourly?.[0]?.weather?.[0]?.description as string | undefined)
    || '';


  const currentBlock = (current as any)?.current || (forecast as any)?.current;
  const humidityVal: number | undefined = currentBlock?.humidity
    ?? (data as any)?.main?.humidity
    ?? (hourly?.[0]?.humidity as number | undefined)
    ?? (daily?.[0]?.humidity as number | undefined);
  const pressureVal: number | undefined = currentBlock?.pressure
    ?? (data as any)?.main?.pressure
    ?? (hourly?.[0]?.pressure as number | undefined)
    ?? (daily?.[0]?.pressure as number | undefined);
  const uviVal: number | undefined = currentBlock?.uvi
    ?? (hourly?.[0]?.uvi as number | undefined)
    ?? (daily?.[0]?.uvi as number | undefined);
  const visRaw: number | undefined = currentBlock?.visibility
    ?? ((data as any)?.visibility as number | undefined)
    ?? (hourly?.[0]?.visibility as number | undefined);
  const visibilityDisplay = typeof visRaw === 'number' ? `${(visRaw / 1000).toFixed(1)} km` : '—';

  return (
    <div className="weather-detail">
      <header className="weather-detail-header">
        <h2>{name}</h2>
        <div className="current-conditions">
          <div className="temperature">
            {typeof headerTempRaw === 'number' ? (
              <>
                <span className="value">{Math.round(headerTempRaw)}</span>
                <span className="unit">°{tempUnitLabel}</span>
              </>
            ) : '—'}
          </div>
          <div className="condition">
            {headerCondition}
          </div>
        </div>
      </header>

      {daily.length > 0 && (
        <DailyForecast data={daily} units={units} />
      )}

      <div className="charts-grid">
        <div className="chart-section">
          <TemperatureChart data={hourly} />
        </div>

        <div className="chart-section">
          <PrecipitationChart data={hourly} />
        </div>

        <div className="chart-section">
          <WindChart data={hourly} />
        </div>
      </div>

      <div className="additional-info">
        <div className="info-grid">
          <div className="info-item">
            <label>Humidity</label>
            <span>{typeof humidityVal === 'number' ? `${humidityVal}%` : '—'}</span>
          </div>
          <div className="info-item">
            <label>Pressure</label>
            <span>{typeof pressureVal === 'number' ? `${pressureVal} hPa` : '—'}</span>
          </div>
          <div className="info-item">
            <label>UV Index</label>
            <span>{typeof uviVal === 'number' ? uviVal : '—'}</span>
          </div>
          <div className="info-item">
            <label>Visibility</label>
            <span>{visibilityDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};