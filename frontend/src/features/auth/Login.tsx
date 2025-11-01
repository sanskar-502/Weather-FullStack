import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser, setError, setLoading } from './authSlice';
import { signInWithGoogle, signOut } from '../../services/firebase';
import './Login.css';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(state => state.auth);

  const handleSignIn = async () => {
    try {
      dispatch(setLoading());
      const user = await signInWithGoogle();
      dispatch(setUser(user));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to sign in'));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(setUser(null));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to sign out'));
    }
  };

  if (status === 'loading') {
    return <div className="login-loading">Loading...</div>;
  }

  if (error) {
    return <div className="login-error">Error: {error}</div>;
  }

  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          <span className="user-name">{user.username || user.email}</span>
          <button 
            onClick={handleSignOut}
            className="sign-out-button"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button 
          onClick={handleSignIn}
          className="sign-in-button"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};