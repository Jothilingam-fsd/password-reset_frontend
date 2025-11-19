/**
 * client/src/index.js
 * 
 * React app entrypoint.
 * Imports Bootstrap CSS globally.
 * Renders the main App component inside React.StrictMode.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import Bootstrap CSS globally
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
