import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getIdToken } from '../../services/firebase';

interface FavoriteLocation {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface FavoritesState {
  locations: FavoriteLocation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FavoritesState = {
  locations: [],
  status: 'idle',
  error: null
};

export const fetchFavoritesFromServer = createAsyncThunk(
  'favorites/fetchServer',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getIdToken();
      if (!token) return rejectWithValue('unauthenticated');
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const res = await axios.get(`${apiBase}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data as FavoriteLocation[];
    } catch (err: any) {
      return rejectWithValue(err?.message || 'fetch failed');
    }
  }
);

export const syncFavoriteAdd = createAsyncThunk(
  'favorites/syncAdd',
  async (fav: FavoriteLocation, { rejectWithValue }) => {
    try {
      const token = await getIdToken();
      if (!token) return rejectWithValue('unauthenticated');
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      await axios.post(`${apiBase}/users/favorites`, fav, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return 'ok';
    } catch (err: any) {
      return rejectWithValue(err?.message || 'sync add failed');
    }
  }
);

export const syncFavoriteRemove = createAsyncThunk(
  'favorites/syncRemove',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = await getIdToken();
      if (!token) return rejectWithValue('unauthenticated');
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      await axios.delete(`${apiBase}/users/favorites/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return 'ok';
    } catch (err: any) {
      return rejectWithValue(err?.message || 'sync remove failed');
    }
  }
);

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      state.locations.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.locations = [];
    },
    replaceFavorites: (state, action) => {
      state.locations = action.payload || [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFavoritesFromServer.fulfilled, (state, action) => {
      state.locations = action.payload as FavoriteLocation[];
      state.status = 'succeeded';
    });
    builder.addCase(fetchFavoritesFromServer.rejected, (state) => {
      state.status = 'failed';
    });
  }
});

export const { addFavorite, removeFavorite, clearFavorites, replaceFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
