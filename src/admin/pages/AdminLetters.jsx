import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Copy, Trash2, Mail, Lock, Eye, X, Calendar, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminLetters = () => {
  const { showToast } = useAdminToast();
  const [letters, setLetters] = useState([]);
  const [songs, setSongs] = useState([]);
  const [memories, setMemories] = useState([]);
  const [littleThings, setLittleThings] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'OPEN_WHEN',
    date: new Date().toISOString().split('T')[0],
    unlockDate: new Date().toISOString().split('T')[0],
    preview: '',
    openingLine: 'My dearest,',
    content: '',
    closing: 'Always yours,',
    signature: 'Me',
    locked: false,
    isPrivate: false,
    featured: false,
    songId: '',
    memoryId: '',
    littleThingId: '',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewLetter, setPreviewLetter] = useState(null);

  const fetchAllData = async () => {
    try {
      const res = await api.getLetters();
      if (res.success && Array.isArray(res.data)) {
        setLetters(res.data);
      }
      const sRes = await api.getSongs();
      if (sRes.success && Array.isArray(sRes.data)) setSongs(sRes.data);
      const mRes = await api.getMemories();
      if (mRes.success && Array.isArray(mRes.data)) setMemories(mRes.data);
      const tRes = await api.getLittleThings();
      if (tRes.success && Array.isArray(tRes.data)) setLittleThings(tRes.data);
    } catch (err) {
      showToast('Failed to load letters', 'error');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenAdd = () => {
    setEditingLetter(null);
    setFormData({
      title: '',
      type: 'OPEN_WHEN',
      date: new Date().toISOString().split('T')[0],
      unlockDate: new Date().toISOString().split('T')[0],
      preview: '',
      openingLine: 'My dearest,',
      content: '',
      closing: 'Always yours,',
      signature: 'Me',
      locked: false,
      isPrivate: false,
      featured: false,
      songId: '',
      memoryId: '',
      littleThingId: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (letter) => {
    setEditingLetter(letter);
    setFormData({ ...letter });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (id) => {
    try {
      await api.duplicateLetter(id);
      showToast('Letter duplicated as new draft');
      fetchAllData();
    } catch (err) {
      showToast('Failed to duplicate letter', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLetter) {
        await api.updateLetter(editingLetter.id, formData);
        showToast('Letter updated');
      } else {
        await api.createLetter(formData);
        showToast('New letter written');
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deleteLetter(deleteTargetId);
      showToast('Letter deleted', 'error');
      setDeleteTargetId(null);
      fetchAllData();
    } catch (err) {
      showToast('Failed to delete letter', 'error');
    }
  };

  const filteredLetters = letters.filter((l) => {
    const matchesType = filterType === 'ALL' || (l.type && l.type.toUpperCase() === filterType);
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.preview && l.preview.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Love Letter Vault Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Write, schedule, and manage "Open When" and private letters.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write Letter</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'OPEN_WHEN', 'BIRTHDAY', 'DAILY', 'SPECIAL', 'MEMORY', 'SECRET', 'NOTE'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                filterType === t ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search letters..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <th className="py-3 px-4">Title & Preview</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Unlock Date</th>
              <th className="py-3 px-4">Access Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredLetters.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                  No letters found. Write your first letter.
                </td>
              </tr>
            ) : (
              filteredLetters.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{l.title}</span>
                    <span className="text-slate-400 text-[11px] line-clamp-1">{l.preview}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {l.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{l.unlockDate || l.date || 'Immediate'}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {l.isPrivate ? (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">🔒 Secret</span>
                    ) : l.locked ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">🔒 Locked</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">✓ Public</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewLetter(l)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(l)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(l.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(l.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingLetter ? 'Edit Letter' : 'Write New Letter'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Letter Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Open When You Miss Me"
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="OPEN_WHEN">OPEN WHEN</option>
                    <option value="BIRTHDAY">BIRTHDAY</option>
                    <option value="DAILY">DAILY</option>
                    <option value="SPECIAL">SPECIAL</option>
                    <option value="MEMORY">MEMORY</option>
                    <option value="SECRET">SECRET</option>
                    <option value="NOTE">NOTE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Written Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unlock Date</label>
                  <input
                    type="text"
                    value={formData.unlockDate}
                    onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Envelope Short Preview / Instruction</label>
                <input
                  type="text"
                  value={formData.preview}
                  onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                  placeholder="e.g. Only open this when you really need a hug..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Opening Line</label>
                  <input
                    type="text"
                    value={formData.openingLine}
                    onChange={(e) => setFormData({ ...formData, openingLine: e.target.value })}
                    placeholder="My dearest,"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Closing & Signature</label>
                  <input
                    type="text"
                    value={formData.closing}
                    onChange={(e) => setFormData({ ...formData, closing: e.target.value })}
                    placeholder="Always yours,"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Letter Content</label>
                <textarea
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Write the letter body..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif text-sm leading-relaxed"
                />
              </div>

              {/* Attachment selectors */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Song</label>
                  <select
                    value={formData.songId || ''}
                    onChange={(e) => setFormData({ ...formData, songId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- None --</option>
                    {songs.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Memory</label>
                  <select
                    value={formData.memoryId || ''}
                    onChange={(e) => setFormData({ ...formData, memoryId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- None --</option>
                    {memories.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Little Thing</label>
                  <select
                    value={formData.littleThingId || ''}
                    onChange={(e) => setFormData({ ...formData, littleThingId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- None --</option>
                    {littleThings.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-semibold text-slate-700">Private Secret Letter</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.locked}
                    onChange={(e) => setFormData({ ...formData, locked: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-700">Lock Content Manually</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewLetter(null)} />
          <div className="relative w-full max-w-lg bg-[#080B16] rounded-3xl p-6 sm:p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <button onClick={() => setPreviewLetter(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
              ADMIN PREVIEW MODE
            </span>
            <h3 className="text-2xl font-serif text-[#F8F5F0]">{previewLetter.title}</h3>
            <p className="text-sm font-serif text-[#B8B6C4] italic">{previewLetter.openingLine || 'My dearest,'}</p>
            <p className="text-sm font-serif text-[#F8F5F0] leading-relaxed italic">"{previewLetter.content || 'Content locked'}"</p>
            <p className="text-xs font-serif text-[#D9A6B2]">{previewLetter.closing || 'Always yours,'}</p>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Letter?"
        message="Are you sure you want to delete this letter?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
