import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { authService } from './services/authService';

import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Hydrate auth synchronously before rendering app avoiding UI flashes
authService.initializeAuth().then(() => {
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
});