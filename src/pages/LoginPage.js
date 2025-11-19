import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';

const LoginPage = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // State to disable submit button during request
  const [loading, setLoading] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    // RFC 5322 Official Standard email regex simplified
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Input validations
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      // POST request to backend /login endpoint
      const response = await axios.post('/api/auth/login', {
        email: email.trim(),
        password,
      });

      // Assuming response contains a message and optionally a token or user info
      if (response.data && response.data.token) {
        // For example, store token in localStorage or cookie
        localStorage.setItem('authToken', response.data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          // Redirect to dashboard or home page
          window.location.href = '/dashboard';
        }, 1500);
      } else if (response.data && response.data.user) {
        // If token not used, but user info returned
        setSuccess(`Welcome back, ${response.data.user.email}! Redirecting...`);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setError('Login succeeded but no user data received.');
      }
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '480px' }}>
      <h2 className="mb-4 text-center">Login</h2>

      {error && <AlertMessage variant="danger" message={error} onClose={() => setError('')} />}
      {success && <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <div className="input-group">
            <span className="input-group-text" id="email-addon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="email-addon"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-group">
            <span className="input-group-text" id="password-addon">
              <FaLock />
            </span>
            <input
              type="password"
              className="form-control"
              id="password"
              aria-describedby="password-addon"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
};

export default LoginPage;
