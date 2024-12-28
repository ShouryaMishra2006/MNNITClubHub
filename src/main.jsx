import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClubProvider } from './contexts/clubcontext.jsx';
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ClubProvider>
        <App />
        </ClubProvider>
    </StrictMode>
  );
} else {
  console.error("Root element with id 'root' not found.");
}
