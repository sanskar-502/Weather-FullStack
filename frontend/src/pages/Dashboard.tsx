import React, { useState, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';
import { WeatherCard, WeatherDetail } from '../features/weather';
import { SearchBar } from '../features/search';
import { Location } from '../types';
import { ToastContainer } from '../shared/components/ToastContainer';

interface SelectedLocation {
  cityId: string;
  name: string;
  lat: number;
  lon: number;
}

export const Dashboard: React.FC = () => {
  const favorites = useAppSelector((state: RootState) => state.favorites.locations);
  const recents = useAppSelector((state: RootState) => (state as RootState).recents?.locations || []);

  const [selected, setSelected] = useState<SelectedLocation | null>(null);
  const closeDetail = useCallback(() => setSelected(null), []);

  return (
    <ToastContainer>
      {(showToast) => (
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Weather Dashboard</h1>
            <SearchBar showToast={showToast} />
          </header>
      
          {favorites.length > 0 && (
            <section className="favorites-section">
              <h2>Favorites</h2>
              <div className="weather-cards-grid">
                {favorites.map((location: Location) => (
                  <WeatherCard
                    key={location.id || `${location.name}-${location.lat}-${location.lon}`}
                    cityId={location.id || `${location.name}-${location.lat}-${location.lon}`}
                    name={location.name}
                    lat={location.lat}
                    lon={location.lon}
                    onOpen={(loc) => setSelected(loc)}
                    showToast={showToast}
                  />
                ))}
              </div>
            </section>
          )}

          {recents.length > 0 && (
            <section className="search-results-section">
              <h2>Recent</h2>
              <div className="weather-cards-grid">
                {recents
                  .filter((r: Location) => !favorites.some(f => (f.id || `${f.name}-${f.lat}-${f.lon}`) === (r.id || `${r.name}-${r.lat}-${r.lon}`)))
                  .map((location: Location) => (
                    <WeatherCard
                      key={location.id || `${location.name}-${location.lat}-${location.lon}`}
                      cityId={location.id || `${location.name}-${location.lat}-${location.lon}`}
                      name={location.name}
                      lat={location.lat}
                      lon={location.lon}
                      onOpen={(loc) => setSelected(loc)}
                      showToast={showToast}
                    />
                  ))}
              </div>
            </section>
          )}

          {selected && (
            <div className="modal-backdrop" onClick={closeDetail}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <button onClick={closeDetail} className="modal-close" aria-label="Close">✕</button>
                </div>
                <WeatherDetail cityId={selected.cityId} name={selected.name} lat={selected.lat} lon={selected.lon} />
              </div>
            </div>
          )}
        </div>
      )}
    </ToastContainer>
  );
};
