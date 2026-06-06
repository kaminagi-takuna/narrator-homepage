import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import VoiceCheck from './VoiceCheck.jsx';
import './index.css';
import './VoiceCheck.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem' }}>
      <VoiceCheck />
    </div>
  </StrictMode>
);
