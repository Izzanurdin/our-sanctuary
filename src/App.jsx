import { useState, useEffect } from 'react';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import DailyChecklistView from './views/DailyChecklistView';
import LoveLifeView from './views/LoveLifeView';
import MissYouView from './views/MissYouView';
import GardenView from './views/GardenView';
import { PROFILES } from './config/profiles';
import { subscribeToMissYouRealtime, playCelebrationFanfare } from './services/whatsapp';
import { subscribeToPartnerReminders, showWebNotification } from './services/notificationService';

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

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'daily' | 'lovelife' | 'missyou' | 'garden'
  const [globalAlert, setGlobalAlert] = useState(null);

  // Global Realtime Listeners (Sinyal Rindu & Pengingat Sehat Pop-up)
  useEffect(() => {
    if (!currentUser?.id) return;

    let isMounted = true;
    const partnerRole = currentUser.role === 'boyfriend' ? 'girlfriend' : 'boyfriend';
    const partnerProfile = PROFILES.find((p) => p.role === partnerRole);
    const partnerName = partnerProfile?.name || (currentUser.name === 'Izza' ? 'Cahayu' : 'Izza');

    // 1. Dengarkan Sinyal Rindu Realtime
    const missYouChannel = subscribeToMissYouRealtime((newLog) => {
      if (!isMounted) return;
      if (newLog.sender_id !== currentUser.id) {
        playCelebrationFanfare();

        // Tampilkan notifikasi pop-up native OS / HP
        showWebNotification({
          title: `💖 Sinyal Rindu dari ${partnerName}!`,
          body: `${partnerName} baru saja mengirim ${newLog.click_count || 1}x ketukan rindu (${newLog.milestone_text || 'Rindu Berat'})! 💕`,
          icon: '/icon-192.png',
          tag: 'miss-you-signal',
        });

        // Tampilkan floating banner jika sedang di halaman lain
        if (currentView !== 'missyou') {
          setGlobalAlert({
            type: 'missyou',
            title: `💖 Sinyal Rindu dari ${partnerName}!`,
            body: `${newLog.click_count || 1}x ketukan rindu (${newLog.milestone_text || 'Rindu Berat'}). Sentuh untuk membalas 💕`,
            targetView: 'missyou',
          });
        }
      }
    });

    // 2. Dengarkan Pengingat Sehat Realtime dari Pasangan
    const reminderChannel = subscribeToPartnerReminders(currentUser.id, (payload) => {
      if (!isMounted) return;
      if (currentView !== 'daily') {
        setGlobalAlert({
          type: 'reminder',
          title: `⏰ Pengingat Sehat dari ${payload.senderName || partnerName}!`,
          body: payload.message,
          targetView: 'daily',
        });
      }
    });

    return () => {
      isMounted = false;
      missYouChannel?.unsubscribe?.();
      reminderChannel?.unsubscribe?.();
    };
  }, [currentUser?.id, currentUser?.name, currentUser?.role, currentView]);

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

  const renderCurrentView = () => {
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
      case 'garden':
        return (
          <GardenView
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
  };

  return (
    <>
      {/* Floating In-App Realtime Notification Banner */}
      {globalAlert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${
              globalAlert.type === 'missyou'
                ? 'bg-rose-950/90 border-pink-500/50 text-pink-100 shadow-[0_0_30px_rgba(244,114,182,0.3)]'
                : 'bg-teal-950/90 border-emerald-500/50 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl shrink-0">
                {globalAlert.type === 'missyou' ? '💖' : '⏰'}
              </span>
              <div>
                <p className="text-xs font-bold leading-tight">{globalAlert.title}</p>
                <p className="text-[11px] opacity-85 leading-snug line-clamp-2">
                  {globalAlert.body}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentView(globalAlert.targetView);
                  setGlobalAlert(null);
                }}
                className="py-1 px-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold active:scale-95 transition-all"
              >
                Lihat
              </button>
              <button
                type="button"
                onClick={() => setGlobalAlert(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/70 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {renderCurrentView()}
    </>
  );
}