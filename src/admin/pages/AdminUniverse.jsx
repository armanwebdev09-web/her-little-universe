import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Sparkles, MapPin, Eye, X, Star } from 'lucide-react';
import { api } from '../../services/api';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminUniverse = () => {
  const { showToast } = useAdminToast();
  const [stars, setStars] = useState([]);
  const [songs, setSongs] = useState([]);
  const [memories, setMemories] = useState([]);
  const [letters, setLetters] = useState([]);
  const [littleThings, setLittleThings] = useState([]);
  const [storyEvents, setStoryEvents] = useState([]);

  const [selectedStar, setSelectedStar] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStar, setEditingStar] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'MEMORY',
    description: '',
    imageUrl: '',
    positionX: 50,
    positionY: 50,
    size: 1.0,
    brightness: 1.0,
    featured: false,
    songId: '',
    memoryId: '',
    letterId: '',
    littleThingId: '',
    storyEventId: '',
    status: 'PUBLISHED',
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewStar, setPreviewStar] = useState(null);

  const fetchAllData = async () => {
    try {
      const res = await api.getUniverseStars();
      if (res.success && Array.isArray(res.data)) {
        setStars(res.data);
        if (res.data.length > 0 && !selectedStar) setSelectedStar(res.data[0]);
      }
      const sRes = await api.getSongs();
      if (sRes.success && Array.isArray(sRes.data)) setSongs(sRes.data);
      const mRes = await api.getMemories();
      if (mRes.success && Array.isArray(mRes.data)) setMemories(mRes.data);
      const lRes = await api.getLetters();
      if (lRes.success && Array.isArray(lRes.data)) setLetters(lRes.data);
      const tRes = await api.getLittleThings();
      if (tRes.success && Array.isArray(tRes.data)) setLittleThings(tRes.data);
      const stRes = await api.getStoryEvents();
      if (stRes.success && Array.isArray(stRes.data)) setStoryEvents(stRes.data);
    } catch (err) {
      showToast('Failed to load universe data', 'error');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleMapClick = async (e) => {
    if (!selectedStar) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    try {
      const updated = { ...selectedStar, positionX: x, positionY: y };
      setSelectedStar(updated);
      await api.updateUniverseStar(selectedStar.id, { positionX: x, positionY: y });
      setStars((prev) => prev.map((s) => (s.id === selectedStar.id ? updated : s)));
      showToast(`Repositioned "${selectedStar.title}" to (${x}%, ${y}%)`);
    } catch (err) {
      showToast('Failed to update star position', 'error');
    }
  };

  const handleOpenAdd = () => {
    setEditingStar(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'MEMORY',
      description: '',
      imageUrl: '',
      positionX: 50,
      positionY: 50,
      size: 1.0,
      brightness: 1.0,
      featured: false,
      songId: '',
      memoryId: '',
      letterId: '',
      littleThingId: '',
      storyEventId: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (star) => {
    setEditingStar(star);
    setFormData({ ...star });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStar) {
        await api.updateUniverseStar(editingStar.id, formData);
        showToast('Universe star updated');
      } else {
        await api.createUniverseStar(formData);
        showToast('New star added to universe');
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
      await api.deleteUniverseStar(deleteTargetId);
      showToast('Star removed from universe', 'error');
      setDeleteTargetId(null);
      fetchAllData();
    } catch (err) {
      showToast('Failed to delete star', 'error');
    }
  };

  const filteredStars = stars.filter((s) => {
    const matchesCategory = filterCategory === 'ALL' || (s.category && s.category.toUpperCase() === filterCategory);
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Universe Visual Layout Editor</h1>
          <p className="text-xs text-slate-500 font-medium">Click anywhere on the star canvas to reposition the selected star.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Star</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Star Map Canvas */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>VISUAL STAR CANVAS</span>
            </span>
            <span>
              Selected: <strong className="text-white">{selectedStar ? selectedStar.title : 'None'}</strong>
            </span>
          </div>

          <div
            onClick={handleMapClick}
            className="relative w-full h-[420px] sm:h-[500px] rounded-2xl bg-[#080B16] border border-slate-800 overflow-hidden cursor-crosshair group"
          >
            {stars.map((star) => {
              const isSelected = selectedStar && selectedStar.id === star.id;
              const posX = star.positionX !== undefined ? star.positionX : star.position?.x || 50;
              const posY = star.positionY !== undefined ? star.positionY : star.position?.y || 50;

              return (
                <div
                  key={star.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStar(star);
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer p-2 rounded-full transition-all ${
                    isSelected ? 'ring-2 ring-rose-500 scale-125 z-20' : 'hover:scale-110 opacity-75'
                  }`}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${isSelected ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-amber-300 shadow-[0_0_8px_#fde047]'}`} />
                  <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 text-[9px] font-mono text-white whitespace-nowrap bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                    {star.title} ({posX}%, {posY}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stars Data List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4 max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              Universe Stars ({filteredStars.length})
            </h3>
          </div>

          <div className="space-y-2">
            {filteredStars.map((star) => {
              const isSelected = selectedStar && selectedStar.id === star.id;
              const posX = star.positionX !== undefined ? star.positionX : star.position?.x || 50;
              const posY = star.positionY !== undefined ? star.positionY : star.position?.y || 50;

              return (
                <div
                  key={star.id}
                  onClick={() => setSelectedStar(star)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    isSelected ? 'bg-rose-50 border-rose-300 shadow-2xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center space-x-1">
                      <span>{star.title}</span>
                      {star.featured && <span className="text-amber-500 font-bold">★</span>}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      Category: {star.category} | Position: {posX}%, {posY}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewStar(star);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(star);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(star.id);
                      }}
                      className="p-1 text-rose-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
              {editingStar ? 'Edit Universe Star' : 'Add Universe Star'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Star Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Beginning Spark"
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type / Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="MEMORY">MEMORY</option>
                    <option value="SONG">SONG</option>
                    <option value="LETTER">LETTER</option>
                    <option value="MILESTONE">MILESTONE</option>
                    <option value="LITTLE_THING">LITTLE_THING</option>
                    <option value="SPECIAL">SPECIAL</option>
                    <option value="BIRTHDAY">BIRTHDAY</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Memory</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the star's meaning..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position X (%)</label>
                  <input
                    type="number"
                    value={formData.positionX}
                    onChange={(e) => setFormData({ ...formData, positionX: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position Y (%)</label>
                  <input
                    type="number"
                    value={formData.positionY}
                    onChange={(e) => setFormData({ ...formData, positionY: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Attachment selectors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Song (Optional)</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">Link Memory (Optional)</label>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Letter (Optional)</label>
                  <select
                    value={formData.letterId || ''}
                    onChange={(e) => setFormData({ ...formData, letterId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="">-- None --</option>
                    {letters.map((l) => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Little Thing (Optional)</label>
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
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-slate-700">Constellation Star (Featured)</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Star
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewStar(null)} />
          <div className="relative w-full max-w-md bg-[#080B16] rounded-3xl p-6 sm:p-8 border border-[#D9A6B2]/30 shadow-2xl z-10 text-center space-y-4">
            <button onClick={() => setPreviewStar(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block">
              ADMIN PREVIEW MODE
            </span>
            <div className="text-3xl text-[#D8B477]">⭐</div>
            <h3 className="text-2xl font-serif text-[#F8F5F0]">{previewStar.title}</h3>
            <span className="text-xs uppercase font-mono text-[#D9A6B2]">{previewStar.category}</span>
            {previewStar.description && (
              <p className="text-xs font-serif text-[#B8B6C4] italic leading-relaxed">"{previewStar.description}"</p>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Star?"
        message="Are you sure you want to remove this star from the universe?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
