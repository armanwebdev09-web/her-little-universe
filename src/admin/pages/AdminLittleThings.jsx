import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, X, Heart, Sparkles, Star, Flower2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminLittleThings = () => {
  const { showToast } = useAdminToast();
  const [littleThings, setLittleThings] = useState([]);
  const [memories, setMemories] = useState([]);
  const [songs, setSongs] = useState([]);
  const [storyEvents, setStoryEvents] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: 'FAVORITE',
    title: '',
    value: '',
    description: '',
    imageUrl: '',
    icon: '🌷',
    songId: '',
    memoryId: '',
    storyEventId: '',
    favorite: false,
    featured: false,
    position: 0,
    status: 'PUBLISHED',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const fetchAllData = async () => {
    try {
      const res = await api.getLittleThings();
      if (res.success && Array.isArray(res.data)) {
        setLittleThings(res.data);
      }
      const memRes = await api.getMemories();
      if (memRes.success && Array.isArray(memRes.data)) setMemories(memRes.data);
      const songRes = await api.getSongs();
      if (songRes.success && Array.isArray(songRes.data)) setSongs(songRes.data);
      const storyRes = await api.getStoryEvents();
      if (storyRes.success && Array.isArray(storyRes.data)) setStoryEvents(storyRes.data);
    } catch (err) {
      showToast('Failed to load items', 'error');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      category: 'FAVORITE',
      title: '',
      value: '',
      description: '',
      imageUrl: '',
      icon: '🌷',
      songId: '',
      memoryId: '',
      storyEventId: '',
      favorite: false,
      featured: false,
      position: littleThings.length + 1,
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateLittleThing(editingItem.id, formData);
        showToast('Little Thing updated');
      } else {
        await api.createLittleThing(formData);
        showToast('New Little Thing added');
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
      await api.deleteLittleThing(deleteTargetId);
      showToast('Item deleted', 'error');
      setDeleteTargetId(null);
      fetchAllData();
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  const filteredItems = littleThings.filter((item) => {
    const matchesFilter = filterCategory === 'ALL' || (item.category && item.category.toUpperCase() === filterCategory);
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">The Little Things</h1>
          <p className="text-xs text-slate-500 font-medium">Manage small personal details, habits, favorites, and inside jokes.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Little Thing</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'FAVORITE', 'LITTLE_HABIT', 'INSIDE_JOKE', 'NICKNAME', 'PLACE', 'SONG', 'FOOD', 'MOVIE', 'BOOK', 'FLOWER', 'PHRASE', 'REASON', 'RANDOM'].map((c) => (
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
            placeholder="Search items..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <th className="py-3 px-4">Icon / Category</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Value & Description</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                  No little things found. Add your first observation.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-base mr-2">{item.icon || '🌷'}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{item.title}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{item.value}</span>
                    <span className="text-slate-500 text-[11px] line-clamp-1">{item.description}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {item.featured ? <span className="text-amber-600 font-semibold">★ Featured</span> : <span className="text-slate-400">-</span>}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(item.id)}
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
              {editingItem ? 'Edit Little Thing' : 'Add New Little Thing'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="FAVORITE">FAVORITE (Favorite Color/Food/etc)</option>
                    <option value="LITTLE_HABIT">LITTLE_HABIT (Cute Habit)</option>
                    <option value="INSIDE_JOKE">INSIDE_JOKE (Inside Joke)</option>
                    <option value="NICKNAME">NICKNAME (Special Name)</option>
                    <option value="PLACE">PLACE (Special Spot)</option>
                    <option value="SONG">SONG (Favorite Song)</option>
                    <option value="FOOD">FOOD (Favorite Food)</option>
                    <option value="MOVIE">MOVIE (Favorite Movie)</option>
                    <option value="BOOK">BOOK (Favorite Book)</option>
                    <option value="FLOWER">FLOWER (Favorite Flower)</option>
                    <option value="PHRASE">PHRASE (Something She Says)</option>
                    <option value="REASON">REASON (Reason I Love Her)</option>
                    <option value="RANDOM">RANDOM (Random Little Fact)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🌷"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title / Label</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Favorite Color"
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Value / Answer</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="e.g. Ocean Blue"
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Note / Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Write the intimate observation or note..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                />
              </div>

              <FileUploadZone
                label="Optional Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                uploadType="image"
                accept="image/*"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Memory (Optional)</label>
                  <select
                    value={formData.memoryId || ''}
                    onChange={(e) => setFormData({ ...formData, memoryId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- No Memory Link --</option>
                    {memories.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Song (Optional)</label>
                  <select
                    value={formData.songId || ''}
                    onChange={(e) => setFormData({ ...formData, songId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- No Song Link --</option>
                    {songs.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} - {s.artist}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="font-semibold text-slate-700">Featured Card (Larger)</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewItem(null)} />
          <div className="relative w-full max-w-md bg-[#080B16] rounded-3xl p-6 sm:p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <button onClick={() => setPreviewItem(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
              ADMIN PREVIEW MODE
            </span>
            <div className="text-3xl">{previewItem.icon || '🌷'}</div>
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#D9A6B2]">{previewItem.title}</h3>
            <h4 className="text-2xl font-serif text-[#F8F5F0]">{previewItem.value}</h4>
            {previewItem.description && (
              <p className="text-xs font-serif text-[#B8B6C4] italic">"{previewItem.description}"</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Little Thing?"
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
