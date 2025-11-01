import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { fetchCurrentWeather } from '../weatherSlice';
import { WeatherData } from '../../../types';

export const useWeatherData = (lat: number, lon: number) => {
  const dispatch = useAppDispatch();
  const { units } = useAppSelector((state: RootState) => state.preferences);
  const key = `${lat}_${lon}_${units}`;
  
  const weather = useAppSelector((state: RootState) => state.weather.byId[key]?.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  const error = useAppSelector((state: RootState) => state.weather.error);

  const fetchWeather = useCallback(() => {
    if (!weather) {
      dispatch(fetchCurrentWeather({ lat, lon, units }));
    }
  }, [dispatch, lat, lon, units, weather]);

  return {
    weather,
    status,
    error,
    fetchWeather,
    key
  };
};