import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// dit maakt de root container voor de React applicatie
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// dit rendert de App component in de root container
// StrictMode wordt gebruikt voor development om potentiële problemen te vinden
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 