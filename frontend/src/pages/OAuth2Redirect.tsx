import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const OAuth2Redirect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed: ' + error);
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Fetch user info
      api.get('/auth/me')
        .then(response => {
          updateUser(response.data);
          toast.success('Logged in with Google! 🎉');
          navigate('/dashboard');
        })
        .catch(() => {
          toast.error('Authentication failed');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-white text-xl font-semibold mb-2">Completing Sign In</h2>
        <p className="text-dark-400">Please wait while we verify your account...</p>
      </div>
    </div>
  );
};

export default OAuth2Redirect;