import apiClient from './apiClient';
import { setAuthSession } from '../utils/auth';

const AuthService = {
  loginWithGoogle: async (idToken) => {
    const response = await apiClient.post('/api/auth/google', { idToken });
    setAuthSession(response.data);
    return response.data;
  },

  getMe: () => apiClient.get('/api/auth/me')
};

export default AuthService;
