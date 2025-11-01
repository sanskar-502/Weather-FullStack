import type { WeatherData } from '../../../types';

interface CacheEntry {
  data: any;
  timestamp: number;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
}

class WeatherCacheService {
  private currentWeatherCache: Map<string, CacheEntry>;
  private forecastCache: Map<string, CacheEntry>;
  private metrics: CacheMetrics;
  private readonly TTL = 60 * 1000; // 60 seconds for real-time data

  constructor() {
    this.currentWeatherCache = new Map();
    this.forecastCache = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0
    };
  }

  private getCacheKey(lat: number, lon: number, units: string): string {
    return `${lat},${lon},${units}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.TTL;
  }

  getCurrentWeather(lat: number, lon: number, units: string): WeatherData | null {
    const key = this.getCacheKey(lat, lon, units);
    const cached = this.currentWeatherCache.get(key);

    if (cached && !this.isExpired(cached)) {
      this.metrics.hits++;
      return cached.data;
    }

    if (cached) {
      this.currentWeatherCache.delete(key);
    }
    this.metrics.misses++;
    return null;
  }

  setCurrentWeather(lat: number, lon: number, units: string, data: WeatherData): void {
    const key = this.getCacheKey(lat, lon, units);
    this.currentWeatherCache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.metrics.size = this.currentWeatherCache.size + this.forecastCache.size;
  }

  getForecast(lat: number, lon: number, units: string): WeatherData[] | null {
    const key = this.getCacheKey(lat, lon, units);
    const cached = this.forecastCache.get(key);

    if (cached && !this.isExpired(cached)) {
      this.metrics.hits++;
      return cached.data;
    }

    if (cached) {
      this.forecastCache.delete(key);
    }
    this.metrics.misses++;
    return null;
  }

  setForecast(lat: number, lon: number, units: string, data: WeatherData[]): void {
    const key = this.getCacheKey(lat, lon, units);
    this.forecastCache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.metrics.size = this.currentWeatherCache.size + this.forecastCache.size;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  clear(): void {
    this.currentWeatherCache.clear();
    this.forecastCache.clear();
    this.metrics.size = 0;
  }
}

export const weatherCacheService = new WeatherCacheService();