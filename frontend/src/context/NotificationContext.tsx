import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: string;
  referenceId?: number;
  referenceType?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  isRead: boolean;
}

interface NotificationPreferences {
  notificationBooking: boolean;
  notificationTicket: boolean;
  notificationComment: boolean;
  notificationSystem: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  preferences: NotificationPreferences | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  updatePreferences: (prefs: NotificationPreferences) => Promise<void>;
  fetchPreferences: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const response = await api.get('/notifications?page=0&size=20');
      setNotifications(response.data.content || []);

      const countResponse = await api.get('/notifications/count');
      setUnreadCount(countResponse.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/notifications/preferences');
      setPreferences(response.data);
    } catch (error) {
      console.error('Failed to fetch preferences');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchPreferences();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications, fetchPreferences]);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true, status: 'READ' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, status: 'READ' })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const updatePreferences = async (prefs: NotificationPreferences) => {
    try {
      const response = await api.put('/notifications/preferences', prefs);
      setPreferences(response.data);
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      preferences,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      updatePreferences,
      fetchPreferences,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};