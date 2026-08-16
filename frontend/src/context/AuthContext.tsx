import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User } from '../types';
import { login as apiLogin, register as apiRegister, setAuthToken } from '../services/api';
import { useToast } from './ToastContext';
import { isClerkEnabled } from '../lib/clerkConfig';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ user?: User; token?: string; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ user?: User; token?: string; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Subcomponent that only executes within ClerkProvider when Clerk is enabled
const ClerkBridge: React.FC<{
  onUserChange: (user: User | null) => void;
  registerSignOut: (fn: () => Promise<void>) => void;
}> = ({ onUserChange, registerSignOut }) => {
  const clerkUser = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (clerk?.signOut) {
      registerSignOut(() => clerk.signOut());
    }
  }, [clerk, registerSignOut]);

  useEffect(() => {
    if (clerkUser?.isSignedIn && clerkUser?.user) {
      const u = clerkUser.user;
      const email = u.primaryEmailAddress?.emailAddress || '';
      const name = u.fullName || u.firstName || (email ? email.split('@')[0] : 'Usuário');
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';

      const activeUser: User = {
        id: `usr_${u.id}`,
        clerkId: u.id,
        name,
        email,
        avatar: u.imageUrl,
        role,
      };
      onUserChange(activeUser);
    } else if (clerkUser?.isLoaded && !clerkUser.isSignedIn) {
      onUserChange(null);
    }
  }, [clerkUser?.isLoaded, clerkUser?.isSignedIn, clerkUser?.user, onUserChange]);

  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [clerkSignOutFn, setClerkSignOutFn] = useState<(() => Promise<void>) | null>(null);
  const { showToast } = useToast();

  // Load saved local user if Clerk is not active
  useEffect(() => {
    try {
      const savedToken =
        localStorage.getItem('token') ||
        localStorage.getItem('ecommerce_auth_token') ||
        localStorage.getItem('aura_auth_token');
      const savedUser =
        localStorage.getItem('ecommerce_user') ||
        localStorage.getItem('aura_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setAuthToken(savedToken);
      }
    } catch (err) {
      console.warn('Error loading user auth context', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        setAuthToken(response.token);
        showToast(`Bem-vindo, ${response.user.name}!`, 'success');
        closeAuthModal();
        return { user: response.user, token: response.token };
      }
      showToast(response.message || 'Verifique seu e-mail e senha.', 'error');
      return { error: response.message || 'Falha na autenticação' };
    } catch (err: any) {
      showToast('Não foi possível autenticar.', 'error');
      return { error: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRegister({ name, email, password });
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        setAuthToken(response.token);
        showToast(`Conta criada com sucesso! Seja bem-vindo, ${name}.`, 'success');
        closeAuthModal();
        return { user: response.user, token: response.token };
      }
      showToast(response.message || 'Tente novamente com outro e-mail.', 'error');
      return { error: response.message || 'Falha no cadastro' };
    } catch (err: any) {
      showToast('Não foi possível criar a conta.', 'error');
      return { error: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (clerkSignOutFn) {
      try {
        await clerkSignOutFn();
      } catch (e) {
        console.warn('Clerk signout error:', e);
      }
    }
    setAuthToken(null);
    setUser(null);
    setToken(null);
    showToast('Você foi desconectado com sucesso.', 'info');
  };

  const isAuthenticated = Boolean(user || token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {isClerkEnabled && (
        <ClerkBridge
          onUserChange={(clerkU) => {
            if (clerkU) {
              setUser(clerkU);
            }
          }}
          registerSignOut={(fn) => setClerkSignOutFn(() => fn)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

