import React, { useState } from 'react';
import {
  Bell, CheckCheck, Trash2, Filter, Settings,
  ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    BOOKING_APPROVED: '✅', BOOKING_REJECTED: '❌',
    BOOKING_CANCELLED: '🚫', BOOKING_PENDING: '⏳',
    TICKET_STATUS_CHANGED: '🔄', TICKET_ASSIGNED: '👨‍🔧',
    TICKET_RESOLVED: '🎉', COMMENT_ADDED: '💬',
    SYSTEM_ALERT: '⚠️', GENERAL: '📢',
  };
  return icons[type] || '🔔';
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications, unreadCount, isLoading,
    preferences, markAsRead, markAllAsRead,
    deleteNotification, updatePreferences,
    fetchNotifications
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [filterType, setFilterType] = useState('ALL');

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread' && n.isRead) return false;
    if (filterType !== 'ALL' && !n.type.startsWith(filterType)) return false;
    return true;
  });

  const prefItems = [
    { key: 'notificationBooking', label: 'Booking Notifications', 
      desc: 'Approvals, rejections, cancellations', icon: '📅' },
    { key: 'notificationTicket', label: 'Ticket Notifications', 
      desc: 'Status changes, assignments', icon: '🎫' },
    { key: 'notificationComment', label: 'Comment Notifications', 
      desc: 'New comments on your tickets', icon: '💬' },
    { key: 'notificationSystem', label: 'System Alerts', 
      desc: 'Important system announcements', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
                <Bell className="text-primary-400" size={20} />
              </div>
              Notifications
              {unreadCount > 0 && (
                <span className="badge bg-primary-500 text-white text-sm px-3 py-1">
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="text-dark-400 mt-1">Stay updated with campus activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchNotifications}
              className="p-2.5 bg-dark-700 hover:bg-dark-600 rounded-xl text-dark-400 hover:text-white transition-all"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 btn-outline text-sm"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-dark-800 border border-dark-700 rounded-xl p-1.5 w-fit">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'settings', label: 'Preferences', icon: <Settings size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-dark-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && preferences && (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-2">Notification Preferences</h2>
            <p className="text-dark-400 text-sm mb-6">
              Choose which notifications you want to receive
            </p>
            <div className="space-y-4">
              {prefItems.map(item => {
                const value = (preferences as any)[item.key];
                return (
                  <div key={item.key}
                    className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-dark-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updatePreferences({ ...preferences, [item.key]: !value })}
                      className={`transition-all ${value ? 'text-primary-400' : 'text-dark-500'}`}
                    >
                      {value
                        ? <ToggleRight size={32} />
                        : <ToggleLeft size={32} />
                      }
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notifications List */}
        {activeTab !== 'settings' && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-dark-400" />
              <span className="text-dark-400 text-sm">Filter:</span>
              {['ALL', 'BOOKING', 'TICKET', 'COMMENT', 'SYSTEM'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === f
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-dark-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="card py-16 text-center">
                  <div className="text-5xl mb-4">🔔</div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                  </h3>
                  <p className="text-dark-400">
                    {activeTab === 'unread'
                      ? 'You\'re all caught up!'
                      : 'Notifications will appear here'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`group card p-4 cursor-pointer hover:border-primary-500/30 transition-all ${
                      !notification.isRead
                        ? 'border-primary-500/20 bg-dark-800'
                        : 'opacity-80'
                    }`}
                    onClick={() => {
                      if (!notification.isRead) markAsRead(notification.id);
                      if (notification.actionUrl) navigate(notification.actionUrl);
                    }}
                  >
                    <div className="flex gap-4">
                      {/* Unread dot */}
                      <div className="flex-shrink-0 pt-1">
                        <div className={`w-2 h-2 rounded-full mt-1 ${
                          !notification.isRead ? 'bg-primary-500' : 'bg-transparent'
                        }`} />
                      </div>

                      {/* Icon */}
                      <div className="text-2xl flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className={`font-semibold ${
                              notification.isRead ? 'text-dark-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-dark-400 text-sm mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-dark-500 text-xs whitespace-nowrap">
                              {formatDistanceToNow(
                                new Date(notification.createdAt), { addSuffix: true }
                              )}
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-dark-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-dark-500 text-xs mt-2">
                          {format(new Date(notification.createdAt), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;