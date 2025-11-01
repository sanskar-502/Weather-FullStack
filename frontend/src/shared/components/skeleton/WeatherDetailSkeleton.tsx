import React from 'react';

export const WeatherDetailSkeleton: React.FC = () => (
  <div className="weather-detail-skeleton">
    <div className="weather-detail-header skeleton">
      <div className="title-skeleton"></div>
    </div>
    <div className="weather-detail-body">
      <div className="current-weather-skeleton">
        <div className="temperature-skeleton skeleton"></div>
        <div className="condition-skeleton skeleton"></div>
      </div>
      <div className="weather-charts-skeleton">
        <div className="chart-skeleton skeleton"></div>
        <div className="chart-skeleton skeleton"></div>
        <div className="chart-skeleton skeleton"></div>
      </div>
      <div className="forecast-skeleton">
        {Array(5).fill(null).map((_, index) => (
          <div key={index} className="forecast-day-skeleton">
            <div className="day-skeleton skeleton"></div>
            <div className="icon-skeleton skeleton"></div>
            <div className="temp-skeleton skeleton"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);