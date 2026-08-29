import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAdminToast } from '../../context/AdminToastContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { showToast } = useAdminToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const success = login(email, password);
    if (success) {
      showToast('Signed in to Admin Dashboard');
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-3xl p-8 shadow-2xl text-center">
        {/* Logo Icon */}
        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Sparkles className="w-7 h-7" />
        </div>

        <span className="text-[10px] tracking-[0.25em] font-mono uppercase text-slate-400 font-semibold block mb-1">
          HER LITTLE UNIVERSE
        </span>
        <h1 className="text-2xl font-bold text-white mb-2">
          ADMIN ACCESS
        </h1>
        <p className="text-xs text-slate-400 font-light mb-8">
          Sign in to manage your little universe.
        </p>

        {/* Developer Warning Alert */}
        <div className="p-3 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] text-left">
          ⚠️ <strong>Developer Notice:</strong> Temporary frontend authentication. Production authentication must be server-side.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-mono uppercase font-semibold text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@herlittleuniverse.com"
                required
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase font-semibold text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => showToast('Password reset link sent to admin email')}
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
