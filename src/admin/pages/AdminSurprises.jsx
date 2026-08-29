import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Calendar, Sparkles, MessageSquare, Quote, Image, Heart, Music, Mail, HelpCircle, Gift } from 'lucide-react';
import { api } from '../../services/api';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminSurprises = () => {
  const { showToast } = useAdminToast();
  const [surprises, setSurprises] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurprise, setEditingSurprise] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'MESSAGE',
    title: '',
    message: '',
    imageUrl: '',
    songId: '',
    memoryId: '',
    letterId: '',
    question: '',
    answer: '',
    buttonText: 'Open Surprise ❤️',
    status: 'PUBLISHED',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewSurprise, setPreviewSurprise] = useState(null);
  const [showAnswerPreview, setShowAnswerPreview] = useState(false);

  const fetchSurprises = async () => {
    try {
      const res = await api.getSurprises();
      if (res.success && Array.isArray(res.data)) {
        setSurprises(res.data);
      }
    } catch (err) {
      showToast('Failed to load surprises', 'error');
    }
  };

  useEffect(() => {
    fetchSurprises();
  }, []);

  const handleOpenAdd = () => {
    setEditingSurprise(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'MESSAGE',
      title: '',
      message: '',
      imageUrl: '',
      songId: '',
      memoryId: '',
      letterId: '',
      question: '',
      answer: '',
      buttonText: 'Open Surprise ❤️',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (surp) => {
    setEditingSurprise(surp);
    setFormData({ ...surp });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSurprise) {
        await api.updateSurprise(editingSurprise.id, formData);
        showToast('Daily surprise updated');
      } else {
        await api.createSurprise(formData);
        showToast('New daily surprise added');
      }
      setIsModalOpen(false);
      fetchSurprises();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deleteSurprise(deleteTargetId);
      showToast('Daily surprise deleted', 'error');
      setDeleteTargetId(null);
      fetchSurprises();
    } catch (err) {
      showToast('Failed to delete surprise', 'error');
    }
  };

  const filteredSurprises = surprises.filter((s) => {
    const matchesFilter = filterType === 'ALL' || (s.type && s.type.toUpperCase() === filterType);
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.message && s.message.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'MESSAGE': return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'QUOTE': return <Quote className="w-3.5 h-3.5 text-amber-500" />;
      case 'PHOTO': return <Image className="w-3.5 h-3.5 text-emerald-500" />;
      case 'MEMORY': return <Heart className="w-3.5 h-3.5 text-rose-500" />;
      case 'SONG': return <Music className="w-3.5 h-3.5 text-[#D8B477]" />;
      case 'LETTER': return <Mail className="w-3.5 h-3.5 text-purple-500" />;
      case 'QUESTION': return <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />;
      default: return <Gift className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Surprises</h1>
          <p className="text-xs text-slate-500 font-medium">Manage one small daily surprise for every single day.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Schedule Overview
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Surprise</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'MESSAGE', 'QUOTE', 'PHOTO', 'MEMORY', 'SONG', 'LETTER', 'QUESTION', 'SURPRISE'].map((t) => (
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
            placeholder="Search surprises..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Calendar Overview */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Surprise Journey Schedule</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Asia/Kolkata Timezone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {surprises.map((s) => (
              <div
                key={s.id}
                onClick={() => handleOpenEdit(s)}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-slate-900">{s.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-semibold flex items-center space-x-1">
                    {getTypeIcon(s.type)}
                    <span>{s.type}</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{s.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{s.message || s.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSurprises.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                    No surprises found. Add the first daily surprise.
                  </td>
                </tr>
              ) : (
                filteredSurprises.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {getTypeIcon(s.type)}
                        <span>{s.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{s.title}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{s.message || s.question}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {s.status || 'PUBLISHED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => { setPreviewSurprise(s); setShowAnswerPreview(false); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(s.id)}
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
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingSurprise ? 'Edit Daily Surprise' : 'Add New Daily Surprise'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Release Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Surprise Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="MESSAGE">MESSAGE (Personal Note)</option>
                    <option value="QUOTE">QUOTE (Love Quote)</option>
                    <option value="PHOTO">PHOTO (Daily Picture)</option>
                    <option value="MEMORY">MEMORY (Link Memory)</option>
                    <option value="SONG">SONG (Link Daily Song)</option>
                    <option value="LETTER">LETTER (Link Letter)</option>
                    <option value="QUESTION">QUESTION (Riddle / Q&A)</option>
                    <option value="SURPRISE">SURPRISE (Special Reveal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Surprise Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              {formData.type === 'PHOTO' && (
                <FileUploadZone
                  label="Upload Surprise Photo"
                  value={formData.imageUrl}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                  uploadType="image"
                  accept="image/*"
                />
              )}

              {formData.type === 'QUESTION' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Question Prompt</label>
                    <textarea
                      rows="2"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="e.g. Do you remember where we..."
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hidden Answer (Revealed on click)</label>
                    <textarea
                      rows="2"
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      placeholder="e.g. The quiet cafe by the harbor..."
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message / Content</label>
                  <textarea
                    rows="3"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write the surprise message..."
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Surprise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewSurprise(null)} />
          <div className="relative w-full max-w-lg bg-[#080B16] rounded-3xl p-6 sm:p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <button onClick={() => setPreviewSurprise(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
              ADMIN PREVIEW MODE
            </span>
            <h3 className="text-2xl font-serif text-[#F8F5F0]">{previewSurprise.title}</h3>
            
            {previewSurprise.imageUrl && (
              <img src={previewSurprise.imageUrl} alt="Surprise" className="w-full h-48 rounded-2xl object-cover border border-[#D9A6B2]/20" />
            )}

            {previewSurprise.type === 'QUESTION' ? (
              <div className="space-y-3">
                <p className="text-sm font-serif text-[#B8B6C4] italic">"{previewSurprise.question}"</p>
                {showAnswerPreview ? (
                  <div className="p-4 rounded-xl bg-[#101528] border border-[#D8B477]/30 text-xs font-serif text-[#D8B477]">
                    Answer: {previewSurprise.answer}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAnswerPreview(true)}
                    className="px-4 py-2 rounded-full bg-[#D9A6B2] text-[#080B16] font-semibold text-xs uppercase"
                  >
                    Reveal Answer
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm font-serif text-[#B8B6C4] italic">"{previewSurprise.message}"</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Surprise?"
        message="Are you sure you want to delete this daily surprise?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
