import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.user) {
          showToast(`Bem-vindo de volta, ${res.user.name}!`, 'success');
          closeAuthModal();
        }
      } else {
        const res = await register(name, email, password);
        if (res.user) {
          showToast('Conta criada com sucesso!', 'success');
          closeAuthModal();
        }
      }
    } catch (err: any) {
      showToast('Falha na autenticação.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@aura.com');
    setPassword('admin123');
    setMode('login');
    showToast('Credenciais de Administrador preenchidas!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden z-10 text-gray-900 p-6 sm:p-8 my-8"
      >
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-3 shadow-sm font-bold text-lg">
            A
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {mode === 'login' ? 'Acessar sua Conta' : 'Criar nova Conta'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Entre com suas credenciais ou acesse como administrador'
              : 'Cadastre-se para acompanhar pedidos e gerenciar sacola'}
          </p>

          {/* Tab Selector */}
          <div className="mt-4 flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === 'login' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === 'register' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Cadastrar
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#FBFBFD] border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              Endereço de E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#FBFBFD] border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-[#FBFBFD] border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-auth-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Entrar' : 'Concluir Cadastro'}</span>
            )}
          </button>

          {/* Quick Admin Access Demo Fill */}
          <div className="pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleAdminQuickFill}
              className="w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0066CC]" />
              <span>Usar Acesso Rápido de Administrador</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
