import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from './types';

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userSet: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    errorSet: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    loadingSet: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    authCleared: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  }
});

export const {
  userSet: setUser,
  errorSet: setError,
  loadingSet: setLoading,
  authCleared: clearAuth
} = slice.actions;

export default slice.reducer;
