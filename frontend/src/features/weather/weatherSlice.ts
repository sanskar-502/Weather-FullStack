import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { weatherService } from './api/weatherService';

import { WeatherData } from '../../types';

interface WeatherEntry {
  data: WeatherData;
  fetchedAt: number;
}

interface WeatherState {
  byId: {
    [key: string]: WeatherEntry;
  };
  forecastsById: {
    [key: string]: { data: WeatherData[], fetchedAt: number };
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  byId: {},
  forecastsById: {},
  status: 'idle',
  error: null,
};

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async ({ lat, lon, units }: { lat: number; lon: number; units: string }) => {
    const response = await weatherService.getCurrent({ lat, lon, units });
    return { 
      key: `${lat}_${lon}_${units}`,
      data: response
    };
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ lat, lon, units }: { lat: number; lon: number; units: string }) => {
    const response = await weatherService.getForecast({ lat, lon, units });
    return {
      key: `${lat}_${lon}_${units}_forecast`,
      data: response
    };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.byId[key] = { data, fetchedAt: Date.now() };
        state.status = 'succeeded';
      })
      .addCase(fetchForecast.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.forecastsById[key] = { data, fetchedAt: Date.now() };
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export default weatherSlice.reducer;