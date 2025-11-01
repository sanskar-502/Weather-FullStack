import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setUnits, syncPreferences } from '../preferencesSlice';
import type { RootState } from '../../../store/store';
import './PreferenceToggles.css';

export const UnitToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const units = useAppSelector((state: RootState) => state.preferences.units);

  const setMetric = () => {
    if (units !== 'metric') {
      dispatch(setUnits('metric'));
      dispatch(syncPreferences());
    }
  };
  const setImperial = () => {
    if (units !== 'imperial') {
      dispatch(setUnits('imperial'));
      dispatch(syncPreferences());
    }
  };

  return (
    <div className="unit-toggle" role="group" aria-label="Temperature units">
      <button
        onClick={setMetric}
        className={`unit-toggle-button ${units === 'metric' ? 'active' : ''}`}
        aria-pressed={units === 'metric'}
        aria-label="Celsius"
      >
        °C
      </button>
      <button
        onClick={setImperial}
        className={`unit-toggle-button ${units === 'imperial' ? 'active' : ''}`}
        aria-pressed={units === 'imperial'}
        aria-label="Fahrenheit"
      >
        °F
      </button>
    </div>
  );
};
