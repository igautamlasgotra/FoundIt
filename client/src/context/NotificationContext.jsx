import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

// Loads the current user's notifications + unread count, polling periodically so
// the nav bell stays roughly up to date. Cheap: one small request per minute.
export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnread(0);
      return;
    }
    try {
      const res = await api('/notifications');
      setNotifications(res.notifications);
      setUnread(res.unread);
    } catch {
      /* ignore transient errors */
    }
  }, [user]);

  const markAllRead = useCallback(async () => {
    await api('/notifications/read', { method: 'POST' });
    setUnread(0);
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }, []);

  useEffect(() => {
    refresh();
    if (!user) return;
    const t = setInterval(refresh, 60000);
    return () => clearInterval(t);
  }, [refresh, user]);

  return (
    <NotificationContext.Provider value={{ notifications, unread, refresh, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
