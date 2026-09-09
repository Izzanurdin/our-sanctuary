import { useState } from 'react';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import DailyChecklistView from './views/DailyChecklistView';
import LoveLifeView from './views/LoveLifeView';
import MissYouView from './views/MissYouView';
import { PROFILES } from './config/profiles';

const STORAGE_KEY = 'ops_current_user';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Sinkronkan otomatis jika ada perubahan nama/avatar di profiles.js
      const matched = PROFILES.find((p) => p.id === parsed.id);
      return matched ? { ...parsed, ...matched } : parsed;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'daily' | 'lovelife' | 'missyou'

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save session to localStorage:', e);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear session from localStorage:', e);
    }
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in, always render LoginView
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Active View Routing
  switch (currentView) {
    case 'daily':
      return (
        <DailyChecklistView
          user={currentUser}
          onBack={handleBackToDashboard}
        />
      );
    case 'lovelife':
      return (
        <LoveLifeView
          user={currentUser}
          onBack={handleBackToDashboard}
        />
      );
    case 'missyou':
      return (
        <MissYouView
          user={currentUser}
          onBack={handleBackToDashboard}
        />
      );
    case 'dashboard':
    default:
      return (
        <DashboardView
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
  }
}