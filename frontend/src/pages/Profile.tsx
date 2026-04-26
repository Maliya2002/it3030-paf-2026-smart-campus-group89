import React, { useState } from 'react';
import { User, Mail, Shield, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.put('/auth/profile', formData);
      updateUser({ name: response.data.name, profilePicture: response.data.profilePicture });
      toast.success('Profile updated successfully! ✨');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500/20 border border-primary-500/30 rounded-xl flex items-center justify-center">
            <User className="text-primary-400" size={20} />
          </div>
          My Profile
        </h1>

        <div className="card">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-2xl border-4 border-primary-500/30"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {isEditing && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer">
                  <Camera size={14} className="text-white" />
                </div>
              )}
            </div>

            {/* Roles */}
            <div className="flex gap-2 mt-3">
              {user?.roles?.map(role => (
                <span key={role} className={`badge ${
                  role === 'ADMIN'
                    ? 'bg-red-500/20 text-red-400'
                    : role === 'TECHNICIAN'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-secondary-500/20 text-secondary-400'
                }`}>
                  <Shield size={10} className="mr-1" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <label className="label flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              ) : (
                <p className="text-white text-lg font-medium p-3 bg-dark-700 rounded-xl">
                  {user?.name}
                </p>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <p className="text-dark-300 p-3 bg-dark-700/50 rounded-xl border border-dark-600">
                {user?.email}
                <span className="ml-2 text-xs text-dark-500">(cannot be changed)</span>
              </p>
            </div>

            <div>
              <label className="label">Login Method</label>
              <div className="p-3 bg-dark-700/50 rounded-xl border border-dark-600 flex items-center gap-2">
                {user?.provider === 'GOOGLE' ? (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-white">Google Account</span>
                  </>
                ) : (
                  <>
                    <Shield size={18} className="text-primary-400" />
                    <span className="text-white">Email & Password</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-dark-700">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Save size={16} />}
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', profilePicture: user?.profilePicture || '' });
                  }}
                  className="btn-outline flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;