import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserRound } from 'lucide-react';
import { registerUser } from '../../utils/auth';
import '../styles/Auth.css';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      registerUser(formData);
      navigate('/home', { replace: true });
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-brand-panel">
        <span className="auth-chip">Create Account</span>
        <h1>Join the smart campus portal.</h1>
        <p>
          Sign up first, then you can enter the homepage and access the modules that are
          already connected in your group project.
        </p>

        <div className="auth-feature">
          <UserRound size={18} />
          <span>Account details are stored locally for this frontend demo flow</span>
        </div>
      </div>

      <div className="auth-panel auth-form-panel">
        <div className="auth-header">
          <h2>Sign Up</h2>
          <p>Create a user account to enter the app.</p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </label>

          <label className="auth-field">
            <span>Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">Campus User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </label>

          <label className="auth-field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </label>

          <button type="submit" className="auth-submit">
            <UserPlus size={18} />
            Sign Up
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
