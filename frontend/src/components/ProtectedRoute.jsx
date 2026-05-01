import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuth2Redirect from './pages/OAuth2Redirect';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

const Placeholder = ({ title, icon }) => (
  <div className="p-6"><div className="card text-center py-16"><div className="text-5xl mb-4">{icon}</div><h2 className="text-2xl font-bold text-white mb-2">{title}</h2><p className="text-dark-400">Module by team member</p></div></div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '12px', fontSize: '14px' }, success: { iconTheme: { primary: '#f97316', secondary: '#fff' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } } }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Layout><Placeholder title="Resources" icon="🏛️" /></Layout></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><Layout><Placeholder title="Bookings" icon="📅" /></Layout></ProtectedRoute>} />
            <Route path="/tickets" element={<ProtectedRoute><Layout><Placeholder title="Tickets" icon="🎫" /></Layout></ProtectedRoute>} />
            <Route path="/tickets/new" element={<ProtectedRoute><Layout><Placeholder title="Create Ticket" icon="🎫" /></Layout></ProtectedRoute>} />
            <Route path="/alltickets" element={<ProtectedRoute><Layout><Placeholder title="All Tickets" icon="📊" /></Layout></ProtectedRoute>} />
            <Route path="/createticket" element={<ProtectedRoute><Layout><Placeholder title="Create Ticket" icon="📋" /></Layout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><Layout><Placeholder title="User Management" icon="👥" /></Layout></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;