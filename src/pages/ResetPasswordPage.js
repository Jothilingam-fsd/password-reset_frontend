// client/src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import AlertMessage from '../components/AlertMessage';

function ResetPasswordPage() {
  const { token } = useParams();
  const [tokenValid, setTokenValid] = useState(false);
  const [loadingToken, setLoadingToken] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      setLoadingToken(true);
      setAlert({ show: false, variant: '', message: '' });

      try {
        const backendBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const url = `${backendBase}/api/auth/reset-password/${token}`;

        const response = await axios.get(url);

        if (response?.data?.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setAlert({ show: true, variant: 'danger', message: response?.data?.message || 'Invalid or expired link.' });
        }
      } catch (error) {
        let message = 'Failed to validate token. Please try again later.';
        if (error?.response?.data?.message) message = error.response.data.message;
        setAlert({ show: true, variant: 'danger', message });
        setTokenValid(false);
      } finally {
        setLoadingToken(false);
      }
    };

    if (token) validateToken();
    else {
      setAlert({ show: true, variant: 'danger', message: 'Invalid password reset link.' });
      setLoadingToken(false);
      setTokenValid(false);
    }
  }, [token]);

  const validatePassword = (pwd) =>
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, variant: '', message: '' });

    if (!validatePassword(password)) {
      setAlert({
        show: true,
        variant: 'danger',
        message:
          'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ show: true, variant: 'danger', message: 'Passwords do not match.' });
      return;
    }

    setFormLoading(true);
    try {
      const backendBase = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const url = `${backendBase}/api/auth/reset-password/${token}`;

      const response = await axios.post(url, { password });

      if (response?.data?.success) {
        setResetSuccess(true);
      } else {
        setAlert({ show: true, variant: 'danger', message: response?.data?.message || 'Failed to reset password.' });
      }
    } catch (error) {
      let message = 'Failed to reset password. Please try again later.';
      if (error?.response?.data?.message) message = error.response.data.message;
      setAlert({ show: true, variant: 'danger', message });
    } finally {
      setFormLoading(false);
    }
  };

  if (loadingToken) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100 px-3">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" aria-label="Loading"></div>
          <p className="mt-3">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
        {alert.show && <AlertMessage variant={alert.variant} message={alert.message} onClose={() => setAlert({ show: false })} />}
        <Link to="/forgot-password" className="btn btn-link mt-3">Back to Forgot Password</Link>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
        <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
          <h2 className="text-center mb-4">Password Reset Successful</h2>
          <p className="text-center">Your password has been reset successfully. You can now log in with your new password.</p>
          <div className="text-center">
            <Link to="/login" className="btn btn-primary">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 px-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        <p className="text-center text-muted mb-4">Enter your new password below.</p>
        {alert.show && <AlertMessage variant={alert.variant} message={alert.message} onClose={() => setAlert({ show: false })} />}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password</label>
            <div className="input-group">
              <span className="input-group-text" id="password-addon"><FaLock /></span>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter new password"
                aria-describedby="password-addon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={formLoading}
                autoComplete="new-password"
              />
            </div>
            <div className="form-text">Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <div className="input-group">
              <span className="input-group-text" id="confirm-password-addon"><FaLock /></span>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirm new password"
                aria-describedby="confirm-password-addon"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={formLoading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={formLoading}>
            {formLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
