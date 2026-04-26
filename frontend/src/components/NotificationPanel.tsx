import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, X, Check, CheckCheck,
  Trash2, Settings, ExternalLink,
  RefreshCw, Loader
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    BOOKING_APPROVED:      '✅',
    BOOKING_REJECTED:      '❌',
    BOOKING_CANCELLED:     '🚫',
    BOOKING_PENDING:       '⏳',
    TICKET_STATUS_CHANGED: '🔄',
    TICKET_ASSIGNED:       '👨‍🔧',
    TICKET_RESOLVED:       '🎉',
    COMMENT_ADDED:         '💬',
    SYSTEM_ALERT:          '⚠️',
    GENERAL:               '📢',
  };
  return icons[type] || '🔔';
};

const getTypeBadgeColor = (type: string) => {
  if (type.startsWith('BOOKING'))  return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (type.startsWith('TICKET'))   return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  if (type === 'COMMENT_ADDED')    return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  if (type === 'SYSTEM_ALERT')     return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-dark-600/50 text-dark-400 border-dark-600';
};

const NotificationPanel: React.FC = () => {
  const navigate   = useNavigate();
  const panelRef   = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // ── Close panel when clicking outside ──────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Refresh when opening ────────────────────────────────────
  const handleOpen = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) fetchNotifications();
  };

  // ── Click notification row ──────────────────────────────────
  const handleRowClick = async (notification: any) => {
    // UPDATE - mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    // Navigate if has URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // ── Mark one read (check button) ────────────────────────────
  const handleMarkOne = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await markAsRead(id);   // PATCH /api/notifications/{id}/read
  };

  // ── Mark all read ───────────────────────────────────────────
  const handleMarkAll = async () => {
    await markAllAsRead();  // PATCH /api/notifications/read-all
  };

  // ── Delete one notification ─────────────────────────────────
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id); // DELETE /api/notifications/{id}
  };

  const recent = notifications.slice(0, 8);

  return (
    <div className="relative" ref={panelRef}>

      {/* ── Bell Button ── */}
      <button
        onClick={handleOpen}
        className="relative p-2.5 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all border border-dark-600 hover:border-primary-500/50"
      >
        <Bell
          size={20}
          className={isOpen ? 'text-primary-400' : 'text-dark-300'}
        />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {isOpen && (
        <div className="absolute right-0 top-13 mt-1 w-96 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700 bg-dark-800/80">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-primary-400" />
              <span className="text-white font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="badge bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Refresh Button - READ */}
              <button
                onClick={fetchNotifications}
                title="Refresh"
                className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-all"
              >
                <RefreshCw
                  size={13}
                  className={isLoading ? 'animate-spin text-primary-400' : ''}
                />
              </button>

              {/* Mark All Read - UPDATE */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  title="Mark all as read"
                  className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-green-400 transition-all"
                >
                  <CheckCheck size={13} />
                </button>
              )}

              {/* Go to full page */}
              <button
                onClick={() => { navigate('/notifications'); setIsOpen(false); }}
                title="Settings"
                className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-all"
              >
                <Settings size={13} />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white transition-all"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto">

            {/* Loading */}
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={24} className="animate-spin text-primary-400" />
              </div>
            ) : recent.length === 0 ? (

              /* Empty State */
              <div className="py-14 text-center">
                <div className="text-5xl mb-3">🔔</div>
                <p className="text-white font-medium">All caught up!</p>
                <p className="text-dark-500 text-sm mt-1">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-dark-700/40">
                {recent.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleRowClick(notification)}
                    className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-dark-700/30 ${
                      !notification.isRead ? 'bg-primary-500/5' : ''
                    }`}
                  >
                    {/* Unread dot */}
                    {!notification.isRead && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
                    )}

                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-9 h-9 rounded-xl border
                      flex items-center justify-center text-base
                      ${getTypeBadgeColor(notification.type)}
                    `}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-tight truncate ${
                        notification.isRead ? 'text-dark-300' : 'text-white'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-dark-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-dark-500 mt-1">
                        {formatDistanceToNow(
                          new Date(notification.createdAt),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">

                      {/* Mark as Read - UPDATE */}
                      {!notification.isRead && (
                        <button
                          onClick={e => handleMarkOne(e, notification.id)}
                          title="Mark as read"
                          className="p-1 hover:bg-green-500/20 rounded-lg text-dark-500 hover:text-green-400 transition-all"
                        >
                          <Check size={11} />
                        </button>
                      )}

                      {/* Delete - DELETE */}
                      <button
                        onClick={e => handleDelete(e, notification.id)}
                        title="Delete"
                        className="p-1 hover:bg-red-500/20 rounded-lg text-dark-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={11} />
                      </button>

                      {/* Open link */}
                      {notification.actionUrl && (
                        <button
                          title="Open"
                          className="p-1 hover:bg-dark-600 rounded-lg text-dark-500 hover:text-white transition-all"
                        >
                          <ExternalLink size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {recent.length > 0 && (
            <div className="px-4 py-3 border-t border-dark-700 bg-dark-800/60">
              <button
                onClick={() => { navigate('/notifications'); setIsOpen(false); }}
                className="w-full text-center text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors py-1"
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;