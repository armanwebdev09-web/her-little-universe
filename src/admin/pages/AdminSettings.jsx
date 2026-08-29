import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { useAdminToast } from '../../context/AdminToastContext';

export const AdminSettings = () => {
  const { showToast } = useAdminToast();
  const [formData, setFormData] = useState({
    siteName: "Her Little Universe",
    herName: siteConfig.herName,
    yourName: "Your Favorite Person",
    birthdayDate: siteConfig.birthdayDate,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Website Settings</h1>
        <p className="text-xs text-slate-500 font-medium">General configuration for Her Little Universe.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Website Title</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              required
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Her Name / Nickname</label>
              <input
                type="text"
                value={formData.herName}
                onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                required
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name / Sign-off</label>
              <input
                type="text"
                value={formData.yourName}
                onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                required
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Global Birthday Date (ISO Format)</label>
            <input
              type="text"
              value={formData.birthdayDate}
              onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
              required
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 font-mono text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold uppercase tracking-wider text-xs shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
