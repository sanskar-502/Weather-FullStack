import { createSlice } from '@reduxjs/toolkit';
import type { Location } from '../../types';

interface RecentsState {
  locations: Location[];
}

const STORAGE_KEY = 'weather_recent_searches';

const loadFromStorage = (): Location[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (locations: Location[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (e) {
    console.error('Failed to save recents to localStorage:', e);
  }
};

const initialState: RecentsState = {
  locations: loadFromStorage(),
};

const MAX_RECENTS = 10;

export const recentsSlice = createSlice({
  name: 'recents',
  initialState,
  reducers: {
    addRecent: (state, action: { payload: Location }) => {
      const item = action.payload;
      const id = item.id || `${item.name}-${item.lat}-${item.lon}`;
      state.locations = state.locations.filter((x) => (x.id || `${x.name}-${x.lat}-${x.lon}`) !== id);
      state.locations.unshift({ ...item, id });
      if (state.locations.length > MAX_RECENTS) {
        state.locations = state.locations.slice(0, MAX_RECENTS);
      }
      saveToStorage(state.locations);
    },
    removeRecent: (state, action: { payload: string }) => {
      state.locations = state.locations.filter((x) => (x.id || `${x.name}-${x.lat}-${x.lon}`) !== action.payload);
      saveToStorage(state.locations);
    },
    clearRecents: (state) => {
      state.locations = [];
      saveToStorage([]);
    },
  },
});

export const { addRecent, removeRecent, clearRecents } = recentsSlice.actions;

export default recentsSlice.reducer;
