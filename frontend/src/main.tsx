import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import { CLERK_PUBLISHABLE_KEY, isClerkEnabled } from './lib/clerkConfig';
import './index.css';

const rootElement = document.getElementById('root')!;

if (isClerkEnabled && CLERK_PUBLISHABLE_KEY) {
  createRoot(rootElement).render(
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}



