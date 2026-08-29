import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Eye, CheckCircle2, AlertTriangle, Sparkles, Music, Camera, Mail, Flower2, Heart, Lock, EyeOff } from 'lucide-react';
import { useAdminToast } from '../../context/AdminToastContext';
import { api } from '../../services/api';

const COUNTDOWN_TYPES = [
  { id: 'SONG', label: 'Song Reveal', icon: '🎵' },
  { id: 'LITTLE_THING', label: 'Little Thing', icon: '🌷' },
  { id: 'MEMORY', label: 'Memory Moment', icon: '📸' },
  { id: 'LETTER', label: 'Love Letter Note', icon: '💌' },
  { id: 'STORY', label: 'Story Milestone', icon: '❤️' },
  { id: 'PHOTO', label: 'Featured Photograph', icon: '🖼️' },
  { id: 'MESSAGE', label: 'Personal Countdown Message', icon: '✨' },
];

export const AdminBirthdayCountdown = () => {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const fetchSchedule = async () => {
    try {
      const res = await api.getAllCountdownAdmin();
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      showToast('Failed to load countdown schedule', 'error');
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = items.map((i) => (i.id === editingItem.id ? editingItem : i));
    setItems(updated);
    setEditingItem(null);
    showToast(`Day ${editingItem.dayOffset} countdown item updated`);
  };

  const handleSaveScheduleToServer = async () => {
    try {
      const res = await api.updateCountdownAdmin(items);
      if (res.success) {
        showToast('Countdown schedule saved successfully!');
      }
    } catch (err) {
      showToast('Failed to save schedule to server', 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Birthday Countdown Planner (Day -7 to Day -1)</h1>
          <p className="text-xs text-slate-500 font-medium">Turn the 7 days before her birthday into a gradual personal story reveal.</p>
        </div>

        <button
          onClick={handleSaveScheduleToServer}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
        >
          Save Countdown Schedule
        </button>
      </div>

      {/* Countdown Days Grid (Day -7 to Day -1) */}
      <div className="space-y-4">
        {items.map((item) => {
          const typeObj = COUNTDOWN_TYPES.find((t) => t.id === item.type) || COUNTDOWN_TYPES[0];
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-mono font-bold text-sm flex flex-col items-center justify-center shrink-0">
                  <span>Day</span>
                  <span>{item.dayOffset}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{typeObj.icon}</span>
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500">
                      {typeObj.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                      {item.status || 'SCHEDULED'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 italic line-clamp-1">"{item.personalMessage}"</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  title="Preview as Her"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setEditingItem({ ...item })}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                >
                  Edit Item
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Countdown Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setEditingItem(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl z-10 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Edit Day {editingItem.dayOffset} Countdown Item</h2>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Type</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                >
                  {COUNTDOWN_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Countdown Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Message / Writing Prompt</label>
                <textarea
                  rows="3"
                  value={editingItem.personalMessage}
                  onChange={(e) => setEditingItem({ ...editingItem, personalMessage: e.target.value })}
                  placeholder="Why did you choose this for her?"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setPreviewItem(null)} />
          <div className="relative w-full max-w-lg bg-[#080B16] rounded-3xl p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#151B30] text-[#D8B477] border border-[#D8B477]/30">
              DAY {previewItem.dayOffset} COUNTDOWN PREVIEW
            </span>

            <h2 className="text-3xl font-serif text-[#F8F5F0]">{previewItem.title}</h2>
            <p className="text-sm text-[#B8B6C4] font-serif italic">"{previewItem.personalMessage}"</p>

            <button
              onClick={() => setPreviewItem(null)}
              className="mt-4 px-6 py-2 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs uppercase"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
