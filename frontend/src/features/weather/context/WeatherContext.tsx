import React, { createContext, useContext, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { Units, WindUnit, PressureUnit, setUnits, setWindUnit, setPressureUnit, setTheme } from '../../preferences/preferencesSlice';

interface WeatherContextType {
  preferences: {
    units: Units;
    windUnit: WindUnit;
    pressureUnit: PressureUnit;
    theme: 'light' | 'dark';
  };
  updateUnits: (units: Units) => void;
  updateWindUnit: (unit: WindUnit) => void;
  updatePressureUnit: (unit: PressureUnit) => void;
  updateTheme: (theme: 'light' | 'dark') => void;
  getWeatherKey: (lat: number, lon: number) => string;
  formatTemperature: (temp: number) => string;
  formatWindSpeed: (speed: number) => string;
  formatPressure: (pressure: number) => string;
}

export const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state: RootState) => state.preferences);

  const updateUnits = useCallback((units: Units) => {
    dispatch(setUnits(units));
  }, [dispatch]);

  const updateWindUnit = useCallback((unit: WindUnit) => {
    dispatch(setWindUnit(unit));
  }, [dispatch]);

  const updatePressureUnit = useCallback((unit: PressureUnit) => {
    dispatch(setPressureUnit(unit));
  }, [dispatch]);

  const updateTheme = useCallback((theme: 'light' | 'dark') => {
    dispatch(setTheme(theme));
  }, [dispatch]);

  const getWeatherKey = useCallback((lat: number, lon: number) => {
    return `${lat}_${lon}_${preferences.units}`;
  }, [preferences.units]);

  const formatTemperature = useCallback((temp: number) => {
    return `${Math.round(temp)}°${preferences.units === 'metric' ? 'C' : 'F'}`;
  }, [preferences.units]);

  const formatWindSpeed = useCallback((speed: number) => {
    switch (preferences.windUnit) {
      case 'km/h':
        return `${Math.round(speed * 3.6)} km/h`;
      case 'mph':
        return `${Math.round(speed * 2.237)} mph`;
      default:
        return `${speed} m/s`;
    }
  }, [preferences.windUnit]);

  const formatPressure = useCallback((pressure: number) => {
    switch (preferences.pressureUnit) {
      case 'inHg':
        return `${Math.round(pressure * 0.02953)} inHg`;
      default:
        return `${pressure} hPa`;
    }
  }, [preferences.pressureUnit]);

  const value = {
    preferences,
    updateUnits,
    updateWindUnit,
    updatePressureUnit,
    updateTheme,
    getWeatherKey,
    formatTemperature,
    formatWindSpeed,
    formatPressure,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};