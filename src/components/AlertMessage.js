/**
 * client/src/components/AlertMessage.js
 * 
 * Reusable React component that shows dismissible Bootstrap alerts
 * for error or success messages.
 * Props:
 *  - message (string): alert text to display
 *  - variant (string): Bootstrap alert variant (danger, success, info, warning)
 *  - onClose (function): callback to hide the alert
 *  - show (boolean, optional): control visibility externally (default true)
 */

import React from 'react';

function AlertMessage({ message, variant = 'info', onClose, show = true }) {
  if (!show) return null;

  return (
    <div className={`alert alert-${variant} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default AlertMessage;
