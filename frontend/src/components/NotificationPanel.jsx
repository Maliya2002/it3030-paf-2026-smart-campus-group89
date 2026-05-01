import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, ExternalLink, RefreshCw, Loader } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const getTypeIcon = (type) => ({ BOOKING_APPROVED: '✅', BOOKING_REJECTED: '❌', BOOKING_CANCELLED: '🚫', TICKET_STATUS_CHANGED: '🔄', TICKET_ASSIGNED: '👨‍🔧', TICKET_RESOLVED: '🎉', COMMENT_ADDED: '💬', SYSTEM_ALERT: '⚠️', GENERAL: '📢' }[type] || '🔔');
const getTypeBg = (type) => { if (type?.startsWith('BOOKING')) return 'bg-blue-500/20 border-blue-500/30'; if (type?.startsWith('TICKET')) return 'bg-orange-500/20 border-orange-500/30'; if (type === 'COMMENT_ADDED') return 'bg-purple-500/20 border-purple-500/30'; return 'bg-dark-600/50 border-dark-600'; };

const NotificationPanel = () => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recent = notifications.slice(0, 8);

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }} className="relative p-2.5 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all border border-dark-600">
        <Bell size={20} className={isOpen ? 'text-primary-400' : 'text-dark-300'} />
        {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-13 mt-1 w-96 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-700">
            <div className="flex items-center gap-2"><Bell size={16} className="text-primary-400" /><span className="text-white font-semibold">Notifications</span>{unreadCount > 0 && <span className="badge bg-primary-500/20 text-primary-400 text-xs">{unreadCount} new</span>}</div>
            <div className="flex items-center gap-1">
              <button onClick={fetchNotifications} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white"><RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} /></button>
              {unreadCount > 0 && <button onClick={markAllAsRead} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-green-400"><CheckCheck size={13} /></button>}
              <button onClick={() => { navigate('/notifications'); setIsOpen(false); }} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white"><Settings size={13} /></button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-dark-700 rounded-lg text-dark-400 hover:text-white"><X size={13} /></button>
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {isLoading && recent.length === 0 ? (<div className="flex items-center justify-center py-12"><Loader size={24} className="animate-spin text-primary-400" /></div>)
            : recent.length === 0 ? (<div className="py-14 text-center"><div className="text-5xl mb-3">🔔</div><p className="text-white font-medium">All caught up!</p><p className="text-dark-500 text-sm mt-1">No notifications</p></div>)
            : (<div className="divide-y divide-dark-700/40">
                {recent.map(n => (
                  <div key={n.id} onClick={async () => { if (!n.isRead) await markAsRead(n.id); if (n.actionUrl) { navigate(n.actionUrl); setIsOpen(false); } }} className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer hover:bg-dark-700/30 ${!n.isRead ? 'bg-primary-500/5' : ''}`}>
                    {!n.isRead && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full" />}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center text-base ${getTypeBg(n.type)}`}>{getTypeIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${n.isRead ? 'text-dark-300' : 'text-white'}`}>{n.title}</p>
                      <p className="text-xs text-dark-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-dark-500 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {!n.isRead && <button onClick={e => { e.stopPropagation(); markAsRead(n.id); }} className="p-1 hover:bg-green-500/20 rounded-lg text-dark-500 hover:text-green-400"><Check size={11} /></button>}
                      <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }} className="p-1 hover:bg-red-500/20 rounded-lg text-dark-500 hover:text-red-400"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>)}
          </div>
          {recent.length > 0 && (<div className="px-4 py-3 border-t border-dark-700"><button onClick={() => { navigate('/notifications'); setIsOpen(false); }} className="w-full text-center text-sm text-primary-400 hover:text-primary-300 font-medium py-1">View all notifications →</button></div>)}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;