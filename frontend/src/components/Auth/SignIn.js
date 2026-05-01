import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { signInUser } from '../../utils/auth';
import '../styles/Auth.css';

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/home';

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

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      signInUser(formData.email, formData.password);
      navigate(redirectPath, { replace: true });
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-brand-panel">
        <span className="auth-chip">Smart Campus Platform</span>
        <h1>Sign in to continue to campus services.</h1>
        <p>
          Access your project homepage first, then move into maintenance and incident
          ticketing from there.
        </p>

        <div className="auth-feature">
          <ShieldCheck size={18} />
          <span>Simple frontend authentication flow for your project demo</span>
        </div>
      </div>

      <div className="auth-panel auth-form-panel">
        <div className="auth-header">
          <h2>Sign In</h2>
          <p>Use your registered email and password.</p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="auth-submit">
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
