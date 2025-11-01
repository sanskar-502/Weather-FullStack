import React from 'react';
import { Skeleton } from '../Skeleton';
import './WeatherCardSkeleton.css';

export const WeatherCardSkeleton: React.FC = () => {
  return (
    <div className="weather-card-skeleton">
      <div className="weather-card-skeleton__header">
        <Skeleton width="60%" height="24px" />
        <Skeleton variant="circular" width="32px" height="32px" />
      </div>
      <div className="weather-card-skeleton__body">
        <Skeleton width="80px" height="48px" className="weather-card-skeleton__temp" />
        <Skeleton width="40%" height="20px" className="weather-card-skeleton__condition" />
        <div className="weather-card-skeleton__details">
          <Skeleton width="45%" height="16px" />
          <Skeleton width="45%" height="16px" />
        </div>
      </div>
    </div>
  );
};