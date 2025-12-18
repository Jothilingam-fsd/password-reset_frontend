// client/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
      // if base provided use full url, otherwise let axios use proxy or relative path
      const url = `${API_BASE_URL}/api/auth/login`;

      const response = await axios.post(url, {
        email: email.trim(),
        password,
      });

      if (response?.data?.token) {
        localStorage.setItem('authToken', response.data.token);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else if (response?.data?.user) {
        setSuccess(`Welcome back, ${response.data.user.email}! Redirecting...`);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else {
        setError(response?.data?.message || 'Login succeeded but no token/user returned.');
      }
    } catch (err) {
      if (err?.response?.data?.message) {
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
          <label htmlFor="email" className="form-label">Email address</label>
          <div className="input-group">
            <span className="input-group-text" id="email-addon"><FaEnvelope /></span>
            <input
              type="email"
              className="form-control"
              id="email"
              aria-describedby="email-addon"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <span className="input-group-text" id="password-addon"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              id="password"
              aria-describedby="password-addon"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading} aria-busy={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        <a href="/forgot-password">Forgot Password?</a>
         <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
