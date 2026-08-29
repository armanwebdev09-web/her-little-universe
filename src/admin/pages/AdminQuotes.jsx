import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Quote as QuoteIcon, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminQuotes = () => {
  const { showToast } = useAdminToast();
  const [quotes, setQuotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [formData, setFormData] = useState({ text: '', subtext: '', active: true });
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchQuotes = async () => {
    const list = await adminService.getQuotes();
    setQuotes(list);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleOpenAdd = () => {
    setEditingQuote(null);
    setFormData({ text: '', subtext: '', active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (quote) => {
    setEditingQuote(quote);
    setFormData({ ...quote });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminService.saveQuote(editingQuote ? { ...formData, id: editingQuote.id } : formData);
    showToast(editingQuote ? 'Quote updated' : 'New quote added');
    setIsModalOpen(false);
    fetchQuotes();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await adminService.deleteQuote(deleteTargetId);
    showToast('Quote deleted', 'error');
    setDeleteTargetId(null);
    fetchQuotes();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-xs text-slate-500 font-medium">Manage daily romantic quotes shown on the homepage.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Quote</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((q) => (
          <div key={q.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <QuoteIcon className="w-4 h-4" />
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ACTIVE
                </span>
              </div>
              <p className="text-base font-serif italic text-slate-800 leading-snug">"{q.text}"</p>
              {q.subtext && <p className="text-xs text-slate-500 mt-1 font-sans">{q.subtext}</p>}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button onClick={() => handleOpenEdit(q)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteTargetId(q.id)} className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 text-left border border-slate-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">{editingQuote ? 'Edit Quote' : 'Add Quote'}</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quote Text</label>
                <textarea
                  rows="3"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtext / Author Note</label>
                <input
                  type="text"
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm">
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Quote?"
        message="Are you sure you want to delete this quote?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
