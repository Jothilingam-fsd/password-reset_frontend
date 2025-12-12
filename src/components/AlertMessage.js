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
