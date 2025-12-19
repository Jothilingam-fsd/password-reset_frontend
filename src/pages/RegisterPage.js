// client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';
import API_BASE_URL from '../config/api';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    variant: '',
    message: '',
  });

  // Email validation
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, variant: '', message: '' });

    // Frontend validations
    if (!fullName.trim()) {
      setAlert({ show: true, variant: 'danger', message: 'Name is required' });
      return;
    }

    if (!validateEmail(email)) {
      setAlert({ show: true, variant: 'danger', message: 'Please enter a valid email' });
      return;
    }

    if (!password || password.length < 8) {
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Password must be at least 8 characters',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({
        show: true,
        variant: 'danger',
        message: 'Passwords do not match',
      });
      return;
    }

    setLoading(true);

    try {
      const url = `${API_BASE_URL}/api/auth/register`;

      const response = await axios.post(url, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        setAlert({
          show: true,
          variant: 'success',
          message: response.data.message || 'Registration successful',
        });

        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setAlert({
          show: true,
          variant: 'danger',
          message: response.data.message || 'Registration failed',
        });
      }
    } catch (err) {
      let message = 'Registration failed. Please try again later.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      }

      setAlert({
        show: true,
        variant: 'danger',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '520px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>

        {alert.show && (
          <AlertMessage
            variant={alert.variant}
            message={alert.message}
            onClose={() => setAlert({ show: false })}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full name
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser />
              </span>
              <input
                type="text"
                id="fullName"
                className="form-control"
                placeholder="Jothi Lingam"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            <div className="form-text">At least 8 characters.</div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaLock />
              </span>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
