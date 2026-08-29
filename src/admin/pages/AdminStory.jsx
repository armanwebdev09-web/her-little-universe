import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Calendar, Sparkles, Heart, Star, Compass, Smile, Flame } from 'lucide-react';
import { api } from '../../services/api';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminStory = () => {
  const { showToast } = useAdminToast();
  const [storyEvents, setStoryEvents] = useState([]);
  const [memories, setMemories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'MILESTONE',
    description: '',
    imageUrl: '',
    memoryId: '',
    featured: false,
    position: 0,
    status: 'PUBLISHED',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);

  const fetchStoryEvents = async () => {
    try {
      const res = await api.getStoryEvents();
      if (res.success && Array.isArray(res.data)) {
        setStoryEvents(res.data);
      }
      const memRes = await api.getMemories();
      if (memRes.success && Array.isArray(memRes.data)) {
        setMemories(memRes.data);
      }
    } catch (err) {
      showToast('Failed to load story events', 'error');
    }
  };

  useEffect(() => {
    fetchStoryEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'MILESTONE',
      description: '',
      imageUrl: '',
      memoryId: '',
      featured: false,
      position: storyEvents.length + 1,
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.updateStoryEvent(editingEvent.id, formData);
        showToast('Story event updated');
      } else {
        await api.createStoryEvent(formData);
        showToast('New story event added');
      }
      setIsModalOpen(false);
      fetchStoryEvents();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deleteStoryEvent(deleteTargetId);
      showToast('Story event deleted', 'error');
      setDeleteTargetId(null);
      fetchStoryEvents();
    } catch (err) {
      showToast('Failed to delete story event', 'error');
    }
  };

  const filteredEvents = storyEvents.filter((s) => {
    const matchesFilter = filterCategory === 'ALL' || (s.category && s.category.toUpperCase() === filterCategory);
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Our Story Events</h1>
          <p className="text-xs text-slate-500 font-medium">Manage chronological relationship milestones and story events.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Story Event</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'BEGINNING', 'MILESTONE', 'MEMORY', 'ADVENTURE', 'SPECIAL_DAY', 'FUNNY', 'GRATEFUL', 'FUTURE'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                filterCategory === c ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search story events..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <th className="py-3 px-4">Pos / Date</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Linked Memory</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                  No story events found. Add your first moment.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-900 block">{evt.date}</span>
                    <span className="text-[10px] text-slate-400">Pos: {evt.position}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 block">{evt.title}</span>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{evt.description}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {evt.memoryId ? (
                      <span className="text-emerald-600 font-semibold">✓ Linked</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewEvent(evt)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(evt.id)}
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
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingEvent ? 'Edit Story Event' : 'Add New Story Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="BEGINNING">BEGINNING (The Start)</option>
                    <option value="MILESTONE">MILESTONE (Key Moment)</option>
                    <option value="MEMORY">MEMORY (Special Memory)</option>
                    <option value="ADVENTURE">ADVENTURE (Trip / Travel)</option>
                    <option value="SPECIAL_DAY">SPECIAL_DAY (Anniversary / Date)</option>
                    <option value="FUNNY">FUNNY (Inside Joke / Laugh)</option>
                    <option value="GRATEFUL">GRATEFUL (Appreciation)</option>
                    <option value="FUTURE">FUTURE (Unwritten Future)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Story Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Story Details</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                />
              </div>

              <FileUploadZone
                label="Event Photo (Optional)"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                uploadType="image"
                accept="image/*"
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Existing Memory (Optional)</label>
                <select
                  value={formData.memoryId || ''}
                  onChange={(e) => setFormData({ ...formData, memoryId: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="">-- No Memory Link --</option>
                  {memories.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-slate-700">Featured Milestone (Larger Card)</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewEvent(null)} />
          <div className="relative w-full max-w-lg bg-[#080B16] rounded-3xl p-6 sm:p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <button onClick={() => setPreviewEvent(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
              ADMIN PREVIEW MODE
            </span>
            <h3 className="text-2xl font-serif text-[#F8F5F0]">{previewEvent.title}</h3>
            {previewEvent.imageUrl && (
              <img src={previewEvent.imageUrl} alt="Event" className="w-full h-48 rounded-2xl object-cover border border-[#D9A6B2]/20" />
            )}
            <p className="text-sm font-serif text-[#B8B6C4] italic">"{previewEvent.description}"</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Story Event?"
        message="Are you sure you want to delete this story event?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
