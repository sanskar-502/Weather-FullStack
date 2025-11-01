import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector } from './store/hooks';
import { AuthProvider } from './features/auth/AuthProvider';
import { WeatherProvider } from './features/weather/context/WeatherContext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './features/auth/Login';
import { UnitToggle } from './features/preferences/components/UnitToggle';
import './styles/index.css';

const Header: React.FC = () => (
  <header className="app-header">
    <div className="brand" aria-label="Weather Dashboard">
      <span className="brand-logo" aria-hidden>⛅</span>
      <span className="brand-name">Weather Dashboard</span>
    </div>
    <div className="header-actions">
      <UnitToggle />
      <Login />
    </div>
  </header>
);

const AppContent: React.FC = () => {
  const { user, status } = useAppSelector((state) => state.auth);

  if (status === 'loading') {
    return (
      <div className="app">
        <Header />
        <main className="centered-screen">
          <div className="login-loading">Loading...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <Header />
        <main className="centered-screen">
          <div className="auth-card">
            <h1>Welcome</h1>
            <p>Please sign in to continue</p>
            <Login />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <WeatherProvider>
          <AppContent />
        </WeatherProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
