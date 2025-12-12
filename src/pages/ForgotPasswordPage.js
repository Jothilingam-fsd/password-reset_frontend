// client/src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, variant: '', message: '' });

    if (!validateEmail(email)) {
      setAlert({ show: true, variant: 'danger', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      const backendBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const url = `${backendBase}/api/auth/forgot-password`;

      const response = await axios.post(url, { email });

      if (response?.data?.success) {
        setAlert({
          show: true,
          variant: 'success',
          message:
            'If an account with that email exists, a password reset link has been sent. Please check your email.',
        });
        setEmail('');
      } else {
        setAlert({
          show: true,
          variant: 'danger',
          message: response?.data?.message || 'Unexpected error occurred.',
        });
      }
    } catch (error) {
      let message = 'Failed to send password reset email. Please try again later.';
      if (error?.response?.data?.message) message = error.response.data.message;
      setAlert({ show: true, variant: 'danger', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        <p className="text-center text-muted mb-4">
          Enter your email address below to receive a password reset link.
        </p>

        {alert.show && (
          <AlertMessage
            variant={alert.variant}
            message={alert.message}
            onClose={() => setAlert({ show: false, variant: '', message: '' })}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="input-group">
              <span className="input-group-text" id="email-addon"><FaEnvelope /></span>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="name@example.com"
                aria-describedby="email-addon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
