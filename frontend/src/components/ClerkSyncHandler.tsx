import React, { useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setAuthToken, syncUserWithBackend } from '../services/api';
import { isClerkEnabled } from '../lib/clerkConfig';

const ClerkActiveSync: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();

  useEffect(() => {
    let isMounted = true;

    async function syncSession() {
      if (isSignedIn && user) {
        try {
          const token = await getToken();
          setAuthToken(token || null);

          const primaryEmail = user.primaryEmailAddress?.emailAddress || '';
          const fullName = user.fullName || user.firstName || (primaryEmail ? primaryEmail.split('@')[0] : 'Cliente');

          const syncResult = await syncUserWithBackend({
            clerkId: user.id,
            email: primaryEmail,
            name: fullName,
            avatar: user.imageUrl,
            role: primaryEmail.toLowerCase().includes('admin') ? 'admin' : 'customer',
          });

          if (isMounted && syncResult.success) {
            console.log('Clerk user synchronized with MySQL database:', syncResult.user);
          }
        } catch (error) {
          console.warn('Clerk sync warning:', error);
        }
      } else if (!isSignedIn) {
        setAuthToken(null);
      }
    }

    syncSession();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user, getToken]);

  return null;
};

export const ClerkSyncHandler: React.FC = () => {
  if (!isClerkEnabled) {
    return null;
  }
  return <ClerkActiveSync />;
};

