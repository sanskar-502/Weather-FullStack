export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country?: string;
}

export interface WeatherCondition {
  description: string;
  icon: string;
  main: string;
}

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface WeatherData {
  current?: CurrentWeather;
  main?: MainWeather;
  weather?: WeatherCondition[];
  wind?: Wind;
}

export type Units = 'metric' | 'imperial';
export type WindSpeedUnit = 'm/s' | 'mph' | 'km/h';
export type PressureUnit = 'hPa' | 'inHg';

export interface UserPreferences {
  units: Units;
  windUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  theme: 'light' | 'dark';
  status?: 'idle' | 'syncing' | 'failed' | 'succeeded';
  error?: string | null;
}

export interface WeatherState {
  byId: Record<string, { data: WeatherData; fetchedAt: number }>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface SearchState {
  query: string;
  results: Location[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface FavoritesState {
  locations: Location[];
}

export interface WeatherCardProps {
  cityId: string;
  name: string;
  lat: number;
  lon: number;
}

export interface WeatherDetailProps {
  location: Location;
  onClose?: () => void;
}

export interface WeatherParams {
  lat: number;
  lon: number;
  units?: Units;
}