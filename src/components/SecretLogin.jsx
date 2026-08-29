import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, ArrowLeft, Key } from 'lucide-react';
import { useSecretAuth } from '../context/SecretAuthContext';

export const SecretLogin = ({ isOpen, onClose, onSuccess }) => {
  const { login, isLoading, error, setError } = useSecretAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setError(null);
    }
  }, [isOpen, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    const success = await login(password);
    if (success) {
      onSuccess();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#080B16]/85 backdrop-blur-xl"
        />

        {/* Unlock Form Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-3xl bg-[#151B30] border border-[#D9A6B2]/30 p-8 shadow-[0_0_60px_rgba(217,166,178,0.25)] text-center z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#B8B6C4] hover:text-[#F8F5F0] hover:bg-[#101528] transition-colors focus:outline-none cursor-pointer"
            aria-label="Close unlock screen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#101528] border border-[#D8B477]/30 flex items-center justify-center mb-4 text-[#D8B477]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <h3 className="text-2xl font-serif font-normal text-[#F8F5F0] mb-2">
            Enter the key
          </h3>
          <p className="text-xs text-[#B8B6C4] font-light mb-6">
            This little corner is just for you.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="secret-password" className="block text-[10px] tracking-[0.2em] uppercase font-sans font-semibold text-[#D8B477] mb-2">
                Secret Key
              </label>

              <div className="relative flex items-center">
                <input
                  id="secret-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter key..."
                  disabled={isLoading}
                  autoFocus
                  className="w-full py-3.5 pl-4 pr-12 rounded-xl bg-[#101528] border border-[#D9A6B2]/20 text-[#F8F5F0] placeholder-[#B8B6C4]/40 text-sm focus:outline-none focus:border-[#D9A6B2] transition-colors font-mono"
                />

                {/* Show / Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 text-[#B8B6C4] hover:text-[#F8F5F0] transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? 'Hide key' : 'Show key'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#D9A6B2]" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className={`w-full py-3.5 px-6 rounded-full font-medium text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                  isLoading || !password.trim()
                    ? 'bg-[#101528] text-[#B8B6C4]/40 border border-[#151B30] cursor-not-allowed'
                    : 'bg-[#D9A6B2] text-[#080B16] hover:bg-[#F8F5F0] shadow-[0_0_20px_rgba(217,166,178,0.4)]'
                }`}
              >
                {isLoading ? (
                  <span>Unlocking...</span>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Unlock Space</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-6 rounded-full bg-transparent text-[#B8B6C4] hover:text-[#F8F5F0] text-xs font-sans tracking-widest uppercase transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
