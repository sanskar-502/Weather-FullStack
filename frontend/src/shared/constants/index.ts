export const API_BASE_URL = 'http://localhost:3001/api';
export const WEATHER_API_UPDATE_INTERVAL = 300000;

export const UNITS = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
} as const;

export const WEATHER_ICONS = {
  'clear-day': '☀️',
  'clear-night': '🌙',
  'partly-cloudy-day': '⛅',
  'partly-cloudy-night': '☁️',
  'cloudy': '☁️',
  'rain': '🌧️',
  'snow': '❄️',
  'thunderstorm': '⛈️',
} as const;

export const STORAGE_KEYS = {
  FAVORITES: 'weather-app-favorites',
  PREFERENCES: 'weather-app-preferences',
  AUTH_TOKEN: 'weather-app-token',
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
