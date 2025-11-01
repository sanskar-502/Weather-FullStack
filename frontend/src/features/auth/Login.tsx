import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser, setError, setLoading } from './authSlice';
import { signInWithGoogle, signOut } from '../../services/firebase';
import './Login.css';

interface LoginProps {
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const Login: React.FC<LoginProps> = ({ showToast }) => {
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector(state => state.auth);

  const handleSignIn = async () => {
    try {
      dispatch(setLoading());
      const user = await signInWithGoogle();
      dispatch(setUser(user));
      if (user) {
        const userName = user.username || user.email.split('@')[0];
        showToast?.(`Welcome back, ${userName}!`, 'success');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      dispatch(setError(errorMessage));
      showToast?.(errorMessage, 'error');
    }
  };

  const handleSignOut = async () => {
    try {
      const userName = user?.username || user?.email.split('@')[0];
      await signOut();
      dispatch(setUser(null));
      showToast?.(`Goodbye, ${userName}!`, 'info');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      dispatch(setError(errorMessage));
      showToast?.(errorMessage, 'error');
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