import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import searchReducer from '../features/search/searchSlice';
import authReducer from '../features/auth/authSlice';
import preferencesReducer from '../features/preferences/preferencesSlice';
import recentsReducer from '../features/recents/recentsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    recents: recentsReducer,
    search: searchReducer,
    auth: authReducer,
    preferences: preferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
