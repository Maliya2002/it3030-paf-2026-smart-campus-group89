import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Building2, Calendar, Wrench,
  Bell, Shield, Zap, Sparkles, GraduationCap,
  Sun, Moon, CloudSun, ChevronRight,
  ArrowUpRight, Activity, CheckCircle,
  Layers, Monitor, BookOpen, Target, Award, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const greetingIcon = hour < 12 ? <Sun className="text-yellow-400" size={28} /> : hour < 17 ? <CloudSun className="text-orange-400" size={28} /> : <Moon className="text-indigo-400" size={28} />;

  const recentNotifications = notifications.slice(0, 5);

  const quickActions = [
    { icon: <Building2 size={28} />, label: 'Browse Resources', desc: 'Explore facilities & equipment', color: 'from-blue-600 via-blue-700 to-indigo-800', hoverColor: 'hover:shadow-blue-500/30', iconBg: 'bg-blue-500/30', path: '/resources', count: '200+', countLabel: 'Available' },
    { icon: <Calendar size={28} />, label: 'My Bookings', desc: 'View & manage reservations', color: 'from-emerald-600 via-green-700 to-teal-800', hoverColor: 'hover:shadow-green-500/30', iconBg: 'bg-green-500/30', path: '/bookings', count: '12', countLabel: 'Active' },
    { icon: <Wrench size={28} />, label: 'Report Issue', desc: 'Submit maintenance ticket', color: 'from-orange-600 via-amber-700 to-orange-800', hoverColor: 'hover:shadow-orange-500/30', iconBg: 'bg-orange-500/30', path: '/tickets/new', count: '3', countLabel: 'Open' },
    { icon: <Bell size={28} />, label: 'Notifications', desc: `${unreadCount} unread alerts`, color: 'from-purple-600 via-violet-700 to-purple-800', hoverColor: 'hover:shadow-purple-500/30', iconBg: 'bg-purple-500/30', path: '/notifications', count: String(unreadCount), countLabel: 'Unread' },
  ];

  const statsCards = [
    { icon: <Bell size={22} />, label: 'Unread Alerts', value: unreadCount, change: '+2 today', color: 'text-primary-400', bgColor: 'bg-primary-500/10 border-primary-500/20', iconColor: 'text-primary-400' },
    { icon: <Shield size={22} />, label: 'Your Role', value: user?.roles?.[0] === 'ADMIN' ? 'Admin' : 'User', change: 'Active', color: user?.roles?.includes('ADMIN') ? 'text-red-400' : 'text-secondary-400', bgColor: user?.roles?.includes('ADMIN') ? 'bg-red-500/10 border-red-500/20' : 'bg-secondary-500/10 border-secondary-500/20', iconColor: user?.roles?.includes('ADMIN') ? 'text-red-400' : 'text-secondary-400' },
    { icon: <Activity size={22} />, label: 'Login Method', value: user?.provider === 'GOOGLE' ? 'Google' : 'Local', change: 'Secure', color: 'text-green-400', bgColor: 'bg-green-500/10 border-green-500/20', iconColor: 'text-green-400' },
    { icon: <CheckCircle size={22} />, label: 'Status', value: 'Active', change: 'Verified', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 border-emerald-500/20', iconColor: 'text-emerald-400' },
  ];

  const campusHighlights = [
    { icon: '🏛️', label: 'Lecture Halls', count: 45, status: 'Available' },
    { icon: '💻', label: 'Computer Labs', count: 12, status: 'Available' },
    { icon: '📽️', label: 'Projectors', count: 30, status: 'In Use' },
    { icon: '🎥', label: 'Cameras', count: 8, status: 'Available' },
    { icon: '📚', label: 'Meeting Rooms', count: 18, status: 'Available' },
    { icon: '🔬', label: 'Science Labs', count: 6, status: 'Occupied' },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-dark-900 to-secondary-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="relative px-6 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className={`flex items-start gap-5 transition-all duration-700 ${animateCards ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="relative flex-shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-20 h-20 rounded-2xl border-2 border-primary-500/40 shadow-glow" />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-glow">
                      <span className="text-white text-3xl font-black">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-dark-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">{greetingIcon}<span className="text-dark-400 text-sm">{greeting}</span></div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-white">Welcome, <span className="bg-gradient-to-r from-primary-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}!</span></h1>
                  <p className="text-dark-400 mt-1 flex items-center gap-2 text-sm">
                    <span>{user?.email}</span>
                    {user?.roles?.map(role => (
                      <span key={role} className={`badge text-xs border ${role === 'ADMIN' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-secondary-500/15 text-secondary-400 border-secondary-500/30'}`}>
                        <Shield size={10} className="mr-1" />{role}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-4 transition-all duration-700 delay-200 ${animateCards ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-dark-800/80 border border-dark-700 rounded-2xl px-6 py-4 text-center">
                  <div className="text-3xl font-bold text-white font-mono tracking-widest">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
                  <div className="text-dark-400 text-xs mt-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="hidden xl:flex bg-primary-500/10 border border-primary-500/20 rounded-2xl px-5 py-4 items-center gap-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow"><GraduationCap className="text-white" size={24} /></div>
                  <div><p className="text-white font-bold text-sm">SLIIT</p><p className="text-dark-400 text-xs">Faculty of Computing</p><p className="text-primary-400 text-xs font-medium">IT3030 · PAF 2026</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, i) => (
              <div key={stat.label} className={`${stat.bgColor} border rounded-2xl p-5 transition-all duration-500 hover:scale-105 ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100 + 300}ms` }}>
                <div className="flex items-center justify-between mb-3"><div className={`p-2 rounded-xl bg-dark-800/50 ${stat.iconColor}`}>{stat.icon}</div><span className="text-xs text-dark-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full" />{stat.change}</span></div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-dark-400 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions + Notifications */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5 mb-5"><div className="p-1.5 bg-primary-500/15 rounded-lg border border-primary-500/20"><Zap size={18} className="text-primary-400" /></div>Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                  <button key={action.path} onClick={() => navigate(action.path)} className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02] ${action.hoverColor} hover:shadow-xl ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${i * 100 + 500}ms` }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-90`} />
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4"><div className={`p-2.5 ${action.iconBg} rounded-xl text-white`}>{action.icon}</div><div className="text-right"><p className="text-2xl font-black text-white/90">{action.count}</p><p className="text-xs text-white/50">{action.countLabel}</p></div></div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">{action.label}<ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" /></h3>
                      <p className="text-white/60 text-sm">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2.5"><div className="p-1.5 bg-purple-500/15 rounded-lg border border-purple-500/20"><Bell size={18} className="text-purple-400" /></div>Recent</h2>
                <button onClick={() => navigate('/notifications')} className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">View all<ChevronRight size={14} /></button>
              </div>
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
                {recentNotifications.length === 0 ? (
                  <div className="py-16 text-center px-4"><div className="w-16 h-16 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4"><Bell size={28} className="text-dark-500" /></div><p className="text-white font-medium">No notifications</p><p className="text-dark-500 text-sm mt-1">You're all caught up! 🎉</p></div>
                ) : (
                  <div className="divide-y divide-dark-700/50">
                    {recentNotifications.map(n => (
                      <div key={n.id} onClick={() => navigate('/notifications')} className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-dark-700/30 ${!n.isRead ? 'bg-primary-500/5' : ''}`}>
                        <div className="flex-shrink-0 mt-2"><div className={`w-2 h-2 rounded-full ${!n.isRead ? 'bg-primary-500 animate-pulse' : 'bg-transparent'}`} /></div>
                        <div className="flex-1 min-w-0"><p className={`text-sm font-semibold truncate ${n.isRead ? 'text-dark-400' : 'text-white'}`}>{n.title}</p><p className="text-xs text-dark-500 mt-0.5 truncate">{n.message}</p><p className="text-xs text-dark-600 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                {recentNotifications.length > 0 && (<div className="p-3 border-t border-dark-700"><button onClick={() => navigate('/notifications')} className="w-full text-sm text-primary-400 hover:text-primary-300 font-medium py-1">See all notifications →</button></div>)}
              </div>
            </div>
          </div>

          {/* Campus Resources */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5 mb-5"><div className="p-1.5 bg-secondary-500/15 rounded-lg border border-secondary-500/20"><Layers size={18} className="text-secondary-400" /></div>Campus Resources</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {campusHighlights.map((item, i) => (
                <div key={item.label} onClick={() => navigate('/resources')} className={`group bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center cursor-pointer hover:border-primary-500/30 hover:scale-105 transition-all ${animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 80 + 800}ms` }}>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <p className="text-2xl font-bold text-white">{item.count}</p>
                  <p className="text-dark-400 text-xs font-medium mt-0.5">{item.label}</p>
                  <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Available' ? 'bg-green-500/15 text-green-400' : item.status === 'In Use' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Available' ? 'bg-green-400' : item.status === 'In Use' ? 'bg-yellow-400' : 'bg-red-400'}`} />{item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-green-400" />System Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'API Server', status: 'Operational', icon: <Monitor size={16} /> },
                  { label: 'Database', status: 'Connected', icon: <Layers size={16} /> },
                  { label: 'Authentication', status: 'Active', icon: <Shield size={16} /> },
                  { label: 'Notifications', status: 'Real-time', icon: <Bell size={16} /> },
                  { label: 'Booking Engine', status: 'Running', icon: <Calendar size={16} /> },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-dark-700/30 rounded-xl border border-dark-700/50">
                    <div className="flex items-center gap-3"><div className="text-dark-400">{item.icon}</div><span className="text-dark-300 text-sm font-medium">{item.label}</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full animate-pulse bg-green-500" /><span className="text-xs font-semibold text-green-400">{item.status}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2"><span className="text-green-400 text-xs font-semibold">System Uptime</span><span className="text-green-400 text-xs font-bold">99.9%</span></div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden"><div className="h-full w-[99.9%] bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" /></div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-dark-800 border border-dark-700 rounded-2xl p-6">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-glow"><GraduationCap className="text-white" size={28} /></div>
                  <div><h3 className="text-xl font-bold text-white">Smart Campus Hub</h3><p className="text-dark-400 text-sm">SLIIT · Faculty of Computing</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: <BookOpen size={16} />, label: 'Course', value: 'IT3030', color: 'text-primary-400' },
                    { icon: <Target size={16} />, label: 'Project', value: 'PAF 2026', color: 'text-secondary-400' },
                    { icon: <Award size={16} />, label: 'Weight', value: '30%', color: 'text-yellow-400' },
                    { icon: <Users size={16} />, label: 'Group', value: 'Active', color: 'text-green-400' },
                  ].map(info => (
                    <div key={info.label} className="p-3 bg-dark-700/50 border border-dark-600/50 rounded-xl">
                      <div className={`flex items-center gap-1.5 ${info.color} mb-1`}>{info.icon}<span className="text-xs font-medium text-dark-400">{info.label}</span></div>
                      <p className="text-white font-bold text-sm">{info.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {['Facilities & Assets Catalogue', 'Booking Management', 'Maintenance & Ticketing', 'Notifications System', 'OAuth 2.0 Authentication'].map(feat => (
                    <div key={feat} className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-400" /><span className="text-dark-300">{feat}</span></div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-green-400 text-xs font-semibold">All Systems Online</span></div>
                  <span className="text-dark-500 text-xs">v1.0.0 · Spring Boot + React</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;