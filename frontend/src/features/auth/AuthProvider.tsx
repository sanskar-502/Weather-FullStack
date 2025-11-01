import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { subscribeToAuthChanges } from '../../services/firebase';
import { setUser, setError, setLoading } from './authSlice';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './types';
import type { RootState } from '../../store/store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, status: authStatus, error } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(setLoading());
    
    const unsubscribe = subscribeToAuthChanges((user) => {
      try {
        dispatch(setUser(user));
        if (user) {
          import('../favorites/favoritesSlice').then(m => {
            const { fetchFavoritesFromServer } = m as any;
            dispatch(fetchFavoritesFromServer() as any);
          });
        }
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Authentication error'));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const value: AuthContextType = {
    user,
    loading: authStatus === 'loading',
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
