import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export interface SearchState {
  query: string;
  results: Location[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  status: 'idle',
  error: null
};

export const searchLocations = createAsyncThunk(
  'search/searchLocations',
  async (query: string) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/search`, {
      params: { q: query }
    });
    return response.data;
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to search locations';
      });
  }
});

export const { setQuery, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;