import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../weather/api/apiClient';

export type Units = 'metric' | 'imperial';
export type WindUnit = 'm/s' | 'km/h' | 'mph';
export type PressureUnit = 'hPa' | 'inHg';

interface PreferencesState {
  units: Units;
  windUnit: WindUnit;
  pressureUnit: PressureUnit;
  theme: 'light' | 'dark';
  status: 'idle' | 'syncing' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: PreferencesState = {
  units: 'metric',
  windUnit: 'm/s',
  pressureUnit: 'hPa',
  theme: 'light',
  status: 'idle',
  error: null,
};

export const syncPreferences = createAsyncThunk(
  'preferences/sync',
  async (_payload: void, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const prefs = state.preferences;

      await apiClient.put('/users/preferences', {
        units: prefs.units,
        windUnit: prefs.windUnit,
        pressureUnit: prefs.pressureUnit,
        theme: prefs.theme,
      });

      return 'ok';
    } catch (err: any) {
      console.warn('preferences sync failed', err?.message || err);
      return rejectWithValue(err?.message || 'sync failed');
    }
  }
);

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setUnits(state, action: { payload: Units }) {
      state.units = action.payload;
    },
    setWindUnit(state, action: { payload: WindUnit }) {
      state.windUnit = action.payload;
    },
    setPressureUnit(state, action: { payload: PressureUnit }) {
      state.pressureUnit = action.payload;
    },
    setTheme(state, action: { payload: 'light' | 'dark' }) {
      state.theme = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncPreferences.pending, (state) => {
        state.status = 'syncing';
        state.error = null;
      })
      .addCase(syncPreferences.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(syncPreferences.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload || action.error?.message || 'Failed to sync preferences';
      });
  }
});

export const { setUnits, setWindUnit, setPressureUnit, setTheme } = preferencesSlice.actions;
export default preferencesSlice.reducer;
