import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:3000/oauth2/redirect';
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-black text-white">SC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Campus</h1>
              <p className="text-dark-400 text-sm">Operations Hub</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Welcome to the future of<br />
            <span className="text-primary-400">Campus Management</span>
          </h2>
          <p className="text-dark-300 text-lg mb-10">
            Streamline facility bookings, maintenance tickets, and campus operations all in one place.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Resources', value: '200+', icon: '🏛️' },
              { label: 'Daily Bookings', value: '1.2K', icon: '📅' },
              { label: 'Tickets Resolved', value: '98%', icon: '✅' },
              { label: 'Active Users', value: '5K+', icon: '👥' },
            ].map((stat) => (
              <div key={stat.label}
                className="bg-dark-700/50 border border-dark-600 rounded-xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* SLIIT Badge */}
          <div className="mt-10 flex items-center gap-2">
            <div className="h-px flex-1 bg-dark-700" />
            <span className="text-dark-400 text-sm px-3">SLIIT · Faculty of Computing</span>
            <div className="h-px flex-1 bg-dark-700" />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-black text-white">SC</span>
            </div>
            <h1 className="text-xl font-bold text-white">Smart Campus</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-dark-400">Access your Smart Campus account</p>
          </div>

          {/* Error from OAuth */}
          {searchParams.get('error') && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400" />
              <span className="text-red-400 text-sm">{searchParams.get('error')}</span>
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all mb-6 shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-dark-700" />
            <span className="text-dark-500 text-sm">or sign in with email</span>
            <div className="h-px flex-1 bg-dark-700" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-dark-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@sliit.lk"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-dark-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;