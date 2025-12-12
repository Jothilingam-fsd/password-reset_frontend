// client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, variant: '', message: '' });

    if (!name.trim()) {
      setAlert({ show: true, variant: 'danger', message: 'Name is required.' });
      return;
    }
    if (!validateEmail(email)) {
      setAlert({ show: true, variant: 'danger', message: 'Please enter a valid email.' });
      return;
    }
    if (!password || password.length < 8) {
      setAlert({ show: true, variant: 'danger', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ show: true, variant: 'danger', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const backendBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const url = `${backendBase}/api/auth/register`;

      const response = await axios.post(url, { name: name.trim(), email: email.trim(), password });

      if (response?.data?.success) {
        // IMPORTANT: do NOT directly log the user in. Show confirmation and ask to verify email if required.
        setAlert({
          show: true,
          variant: 'success',
          message:
            response.data.message ||
            'Registration successful. Please check your email to verify your account before logging in.',
        });

        // Clear only the input fields (do NOT store token or do auto-login)
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setAlert({ show: true, variant: 'danger', message: response?.data?.message || 'Failed to register.' });
      }
    } catch (err) {
      let message = 'Registration failed. Please try again later.';
      if (err?.response?.data?.message) message = err.response.data.message;
      setAlert({ show: true, variant: 'danger', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '520px', width: '100%' }}>
        <h2 className="text-center mb-4">Register</h2>

        {alert.show && <AlertMessage variant={alert.variant} message={alert.message} onClose={() => setAlert({ show: false })} />}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input type="text" id="name" className="form-control" placeholder="Jothi Lingam" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input type="email" id="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} autoComplete="email" />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input type="password" id="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} autoComplete="new-password" />
            </div>
            <div className="form-text">At least 8 characters.</div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input type="password" id="confirmPassword" className="form-control" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} autoComplete="new-password" />
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
