import React, { useCallback, useMemo, useEffect, memo } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { addFavorite, removeFavorite } from '../../favorites/favoritesSlice';
import { RootState } from '../../../store/store';
import { WeatherCardSkeleton } from '../../../shared/components/skeleton/WeatherCardSkeleton';
import { WeatherCardProps as BaseWeatherCardProps } from '../../../types';
import { fetchCurrentWeather } from '../weatherSlice';

type WeatherCardProps = BaseWeatherCardProps & {
  onOpen?: (payload: { cityId: string; name: string; lat: number; lon: number }) => void;
};

const WeatherCardComponent: React.FC<WeatherCardProps> = ({ cityId, name, lat, lon, onOpen }) => {
  const dispatch = useAppDispatch();
  const units = useAppSelector((state: RootState) => state.preferences?.units ?? 'metric');

  const key = useMemo(() => `${lat}_${lon}_${units}`, [lat, lon, units]);

  const weather = useAppSelector((state: RootState) => state.weather.byId[key]?.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  const error = useAppSelector((state: RootState) => state.weather.error);

  const isFavorite = useAppSelector(useCallback(
    (state: RootState) => state.favorites.locations.some(fav => fav.id === cityId),
    [cityId]
  ));

  useEffect(() => {
    if (!weather) {
      dispatch(fetchCurrentWeather({ lat, lon, units }));
    }
  }, [dispatch, lat, lon, units, weather]);

  const handleFavoriteClick = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(cityId));
      import('../../favorites/favoritesSlice').then(m => {
        const { syncFavoriteRemove } = m as any;
        dispatch(syncFavoriteRemove(cityId) as any);
      });
    } else {
      const fav = { id: cityId, name, lat, lon };
      dispatch(addFavorite(fav));
      import('../../favorites/favoritesSlice').then(m => {
        const { syncFavoriteAdd } = m as any;
        dispatch(syncFavoriteAdd(fav) as any);
      });
    }
  }, [dispatch, isFavorite, cityId, name, lat, lon]);

  // Show skeleton while loading and no data yet
  if (!weather && status === 'loading') {
    return <WeatherCardSkeleton />;
  }

  if (error && !weather) {
    return (
      <div className="weather-card weather-card--error" role="alert">
        <div className="weather-card-header">
          <h3>{name}</h3>
        </div>
        <div className="weather-card-body">{error}</div>
      </div>
    );
  }

  if (!weather) {
    return <div className="weather-card">No data</div>;
  }

  return (
    <div className="weather-card" onClick={() => onOpen?.({ cityId, name, lat, lon })} role="button" tabIndex={0}>
      <div className="weather-card-header">
        <h3>{name}</h3>
        <button
          onClick={(e) => handleFavoriteClick(e)}
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <div className="weather-card-body">
        <div className="temperature">
          <span className="value">{Math.round(weather.current?.temp ?? weather.main?.temp ?? 0)}</span>
          <span className="unit">°{units === 'metric' ? 'C' : 'F'}</span>
        </div>
        <div className="weather-condition">
          {weather.current?.weather?.[0]?.description ?? weather.weather?.[0]?.description ?? 'Unknown'}
        </div>
        <div className="weather-details">
          <div>Humidity: {weather.current?.humidity ?? weather.main?.humidity ?? 0}%</div>
          <div>
            Wind: {weather.current?.wind_speed ?? weather.wind?.speed ?? 0}
            {units === 'metric' ? ' m/s' : ' mph'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WeatherCard = memo(WeatherCardComponent);