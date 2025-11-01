import React from 'react';
import { format } from 'date-fns';

interface HourlyForecastItem {
  dt: number;
  temp: number;
  feels_like?: number;
  humidity?: number;
  pop?: number;
  wind_speed?: number;
  weather?: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
}

interface HourlyForecastProps {
  data: HourlyForecastItem[];
  units: 'metric' | 'imperial';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, units }) => {
  if (!data?.length) {
    return null;
  }

  const limitedData = data.slice(0, 24);

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="hourly-forecast-scroll">
        {limitedData.map((hour) => {
          const time = new Date(hour.dt * 1000);
          const isToday = new Date().toDateString() === time.toDateString();
          
          return (
            <div key={hour.dt} className="hourly-forecast-item">
              <div className="time">
                {isToday && format(time, 'HH:mm') === format(new Date(), 'HH:mm')
                  ? 'Now'
                  : format(time, 'HH:mm')}
              </div>
              <div className="date-label">{format(time, 'EEE')}</div>
              {hour.weather?.[0]?.icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                  alt={hour.weather?.[0]?.description || 'Weather icon'}
                  className="weather-icon"
                />
              )}
              <div className="temp">
                {Math.round(hour.temp)}°{units === 'metric' ? 'C' : 'F'}
              </div>
              {hour.weather?.[0]?.main && (
                <div className="condition">{hour.weather[0].main}</div>
              )}
              {typeof hour.pop === 'number' && hour.pop > 0 && (
                <div className="precipitation">
                  💧 {Math.round(hour.pop * 100)}%
                </div>
              )}
              {typeof hour.wind_speed === 'number' && (
                <div className="wind">
                  🌬️ {Math.round(hour.wind_speed)}{units === 'metric' ? ' m/s' : ' mph'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
