import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Calendar, Wrench, Bell, Users, LogOut, User, Menu, X, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from './NotificationPanel';
import toast from 'react-hot-toast';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { icon: <Building2 size={20} />, label: 'Resources', path: '/resources' },
  { icon: <Calendar size={20} />, label: 'Bookings', path: '/bookings' },
  { icon: <Wrench size={20} />, label: 'Tickets', path: '/tickets' },
  { icon: <Bell size={20} />, label: 'Notifications', path: '/notifications' },
  { icon: <Users size={20} />, label: 'Users', path: '/admin/users', adminOnly: true },
];

const Layout = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visible = navItems.filter(item => !item.adminOnly || hasRole('ADMIN'));

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-dark-800 border-r border-dark-700 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-dark-700">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow"><span className="text-white font-black text-sm">SC</span></div>
          <div><h1 className="text-white font-bold text-lg leading-none">Smart Campus</h1><p className="text-dark-500 text-xs">Operations Hub</p></div>
          <button className="ml-auto lg:hidden text-dark-400" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {visible.map(item => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                {item.icon}<span className="flex-1">{item.label}</span>{item.adminOnly && <Shield size={12} className="text-red-400 opacity-70" />}
              </NavLink>
            ))}
          </div>
          <div className="mt-6 p-3 bg-primary-500/10 border border-primary-500/20 rounded-xl"><p className="text-primary-400 text-xs font-semibold">SLIIT · FoC</p><p className="text-dark-500 text-xs">IT3030 PAF 2026</p></div>
        </nav>
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl mb-3">
            {user?.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-9 h-9 rounded-lg border border-primary-500/30" /> : <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span></div>}
            <div className="flex-1 min-w-0"><p className="text-white text-sm font-semibold truncate">{user?.name}</p><p className="text-dark-500 text-xs truncate">{user?.email}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { navigate('/profile'); setSidebarOpen(false); }} className="flex items-center justify-center gap-2 px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-dark-300 hover:text-white text-sm"><User size={14} />Profile</button>
            <button onClick={() => { logout(); toast.success('Logged out'); }} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 text-sm"><LogOut size={14} />Logout</button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-dark-800 border-b border-dark-700 px-6 py-3 flex items-center gap-4">
          <button className="lg:hidden p-2 bg-dark-700 rounded-lg text-dark-300" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="flex-1" />
          <NotificationPanel />
          <div className="h-6 w-px bg-dark-700" />
          <button onClick={() => navigate('/profile')} className="flex items-center gap-2 hover:opacity-80">
            {user?.profilePicture ? <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-lg border border-primary-500/30" /> : <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center"><span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span></div>}
            <span className="text-dark-300 text-sm hidden md:block">{user?.name}</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;