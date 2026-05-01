import React, { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, Check } from 'lucide-react';
import NotificationService from '../../services/NotificationService';
import '../styles/NotificationPanel.css';

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getMyNotifications();
      setNotifications(response.data || []);
      
      const unreadResp = await NotificationService.getUnreadCount();
      setUnreadCount(unreadResp.data || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const deleteAllNotifications = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await NotificationService.deleteAllNotifications();
        await loadNotifications();
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="notification-wrap">
      <button 
        type="button" 
        className="nav-item notification-trigger" 
        onClick={() => setOpen(!open)}
        title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      >
        <Bell size={16} />
        Notifications
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-header">
            <h4>Notifications</h4>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <>
                  <button 
                    type="button" 
                    className="btn-icon" 
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    aria-label="Mark all as read"
                  >
                    <CheckCheck size={14} />
                  </button>
                  <button 
                    type="button" 
                    className="btn-icon btn-delete" 
                    onClick={deleteAllNotifications}
                    title="Delete all"
                    aria-label="Delete all"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="notification-filter">
              <button
                type="button"
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
            </div>
          )}

          {loading && <p className="notification-loading">Loading...</p>}

          {!loading && filteredNotifications.length === 0 && (
            <p className="notification-empty">
              {filter === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
            </p>
          )}

          <div className="notification-list">
            {filteredNotifications.map((item) => (
              <div 
                key={item.id} 
                className={`notification-item ${item.isRead ? 'read' : 'unread'}`}
              >
                <div className="notification-content">
                  <div className="notification-type">
                    <span className={`type-badge type-${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="notification-body">
                    <p className="notification-message">{item.message}</p>
                    <small className="notification-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
                <div className="notification-item-actions">
                  {!item.isRead && (
                    <button 
                      type="button" 
                      className="btn-icon btn-mark-read"
                      onClick={() => markAsRead(item.id)}
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="btn-icon btn-delete"
                    onClick={() => deleteNotification(item.id)}
                    title="Delete"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;

