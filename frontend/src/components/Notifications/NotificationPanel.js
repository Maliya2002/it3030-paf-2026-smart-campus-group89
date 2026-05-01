import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import NotificationService from '../../services/NotificationService';

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const loadNotifications = async () => {
    try {
      const response = await NotificationService.getMyNotifications();
      setNotifications(response.data || []);
    } catch (error) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    await NotificationService.markAsRead(id);
    await loadNotifications();
  };

  return (
    <div className="notification-wrap">
      <button type="button" className="nav-item notification-trigger" onClick={() => setOpen((value) => !value)}>
        <Bell size={16} />
        Notifications
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-panel">
          <h4>Notifications</h4>
          {notifications.length === 0 && <p className="notification-empty">No notifications yet.</p>}
          {notifications.map((item) => (
            <div key={item.id} className={`notification-item ${item.read ? 'read' : 'unread'}`}>
              <p>{item.message}</p>
              {!item.read && (
                <button type="button" onClick={() => markAsRead(item.id)}>
                  <CheckCheck size={14} />
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
