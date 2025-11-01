import React from 'react';
import { format } from 'date-fns';

interface DailyForecast {
  dt: number;
  temp: {
    min: number;
    max: number;
    day: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface DailyForecastProps {
  data: DailyForecast[];
  units: 'metric' | 'imperial';
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ data, units }) => {
  if (!data?.length) {
    return null;
  }

  return (
    <div className="daily-forecast">
      <h3>7-Day Forecast</h3>
      <div className="daily-forecast-grid">
        {data.map((day) => (
          <div key={day.dt} className="daily-forecast-item">
            <div className="date">{format(new Date(day.dt * 1000), 'EEE, MMM d')}</div>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="weather-icon"
            />
            <div className="temp-range">
              <span className="max">{Math.round(day.temp.max)}°{units === 'metric' ? 'C' : 'F'}</span>
              <span className="min">{Math.round(day.temp.min)}°{units === 'metric' ? 'C' : 'F'}</span>
            </div>
            <div className="description">{day.weather[0].description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};