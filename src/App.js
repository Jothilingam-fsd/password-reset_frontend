import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/forgot-password" replace />} />
        {/* Catch-all route redirects to forgot-password */}
        <Route path="*" element={<Navigate to="/forgot-password" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
