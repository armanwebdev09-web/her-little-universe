import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Heart, X, Image as ImageIcon } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminMemories = () => {
  const { showToast } = useAdminToast();
  const [memories, setMemories] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'MOMENTS',
    description: '',
    image: '',
    favorite: false,
  });

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchMemories = async () => {
    const list = await adminService.getMemories();
    setMemories(list);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleOpenAdd = () => {
    setEditingMemory(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'MOMENTS',
      description: '',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      favorite: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem) => {
    setEditingMemory(mem);
    setFormData({ ...mem, image: mem.image || mem.imageUrl });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminService.saveMemory(editingMemory ? { ...formData, id: editingMemory.id } : formData);
    showToast(editingMemory ? 'Memory updated' : 'New memory added');
    setIsModalOpen(false);
    fetchMemories();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await adminService.deleteMemory(deleteTargetId);
    showToast('Memory deleted', 'error');
    setDeleteTargetId(null);
    fetchMemories();
  };

  const filteredMemories = memories.filter((mem) => {
    const matchesFilter = filter === 'ALL' || (mem.category && mem.category.toUpperCase() === filter);
    const matchesSearch =
      mem.title.toLowerCase().includes(search.toLowerCase()) ||
      (mem.description && mem.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Memories</h1>
          <p className="text-xs text-slate-500 font-medium">Manage relationship scrapbook snapshots.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'MOMENTS', 'ADVENTURES', 'SPECIAL DAYS', 'RANDOM'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                filter === f ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Memories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMemories.map((mem) => (
          <div key={mem.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-slate-100">
                <img src={mem.image || mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                {mem.favorite && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-500 text-white shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>
                )}
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-slate-900/80 text-white backdrop-blur-md">
                  {mem.category}
                </span>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">{mem.date}</span>
                <h4 className="text-base font-bold text-slate-900 leading-snug">{mem.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{mem.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button onClick={() => handleOpenEdit(mem)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteTargetId(mem.id)} className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left border border-slate-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingMemory ? 'Edit Memory' : 'Add New Memory'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Memory Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="MOMENTS">MOMENTS</option>
                    <option value="ADVENTURES">ADVENTURES</option>
                    <option value="SPECIAL DAYS">SPECIAL DAYS</option>
                    <option value="RANDOM">RANDOM</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Zone */}
              <FileUploadZone
                label="Memory Photo"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                uploadType="image"
                accept="image/*"
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="fav-check"
                  checked={formData.favorite}
                  onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                  className="rounded border-slate-300 text-rose-500 focus:ring-0"
                />
                <label htmlFor="fav-check" className="font-semibold text-slate-700">Mark as Favorite</label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm hover:bg-rose-500">
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Memory?"
        message="Are you sure you want to delete this memory snapshot?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
