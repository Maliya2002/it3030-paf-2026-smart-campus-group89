import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import OAuth2Redirect from './pages/OAuth2Redirect';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

// App components
import Home from './components/Home/Home';
import CreateTicket from './components/CreateTicket/CreateTicket';
import TicketList from './components/TicketList/TicketList';
import TicketDetails from './components/TicketDetails/TicketDetails';

// Placeholder pages for other modules
const ResourcesPage = () => (
  <div className="p-6">
    <div className="card text-center py-16">
      <div className="text-5xl mb-4">🏛️</div>
      <h2 className="text-2xl font-bold text-white mb-2">Resources Module</h2>
      <p className="text-dark-400">Implemented by Team Member 1</p>
    </div>
  </div>
);

const BookingsPage = () => (
  <div className="p-6">
    <div className="card text-center py-16">
      <div className="text-5xl mb-4">📅</div>
      <h2 className="text-2xl font-bold text-white mb-2">Bookings Module</h2>
      <p className="text-dark-400">Implemented by Team Member 2</p>
    </div>
  </div>
);

const AdminUsersPage = () => (
  <div className="p-6">
    <div className="card text-center py-16">
      <div className="text-5xl mb-4">👥</div>
      <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
      <p className="text-dark-400">Admin Only</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/home" element={
              <ProtectedRoute>
                <Layout><Home /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/createticket" element={
              <ProtectedRoute>
                <Layout><CreateTicket /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/alltickets" element={
              <ProtectedRoute>
                <Layout><TicketList /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/ticketdetails/:id" element={
              <ProtectedRoute>
                <Layout><TicketDetails /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/tickets" element={
              <ProtectedRoute>
                <Layout><TicketList /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tickets/new" element={
              <ProtectedRoute>
                <Layout><CreateTicket /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/resources" element={
              <ProtectedRoute>
                <Layout><ResourcesPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/bookings" element={
              <ProtectedRoute>
                <Layout><BookingsPage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout><Notifications /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/admin/users" element={
              <ProtectedRoute roles={['ADMIN']}>
                <Layout><AdminUsersPage /></Layout>
              </ProtectedRoute>
            } />

            {/* Default */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Home /></Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <ProtectedRoute>
                <Layout><Home /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;