import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Lock, Camera, Video, Mail, Moon, FileText, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminSecret = () => {
  const { showToast } = useAdminToast();
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    type: 'PHOTO',
    title: '',
    date: '',
    caption: '',
    content: '',
    image: '',
    videoUrl: '',
  });
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchSecret = async () => {
    const list = await adminService.getSecretItems();
    setItems(list);
  };

  useEffect(() => {
    fetchSecret();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'PHOTO',
      title: '',
      date: new Date().toISOString().split('T')[0],
      caption: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      videoUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'PHOTO',
      title: item.title || '',
      date: item.date || '',
      caption: item.caption || '',
      content: item.content || '',
      image: item.image || item.imageUrl || '',
      videoUrl: item.videoUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminService.saveSecretItem(editingItem ? { ...formData, id: editingItem.id } : formData);
    showToast(editingItem ? 'Secret item updated' : 'Secret item added');
    setIsModalOpen(false);
    fetchSecret();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await adminService.deleteSecretItem(deleteTargetId);
    showToast('Secret item deleted', 'error');
    setDeleteTargetId(null);
    fetchSecret();
  };

  const filteredItems = items.filter((item) => {
    return filterType === 'ALL' || (item.type && item.type.toUpperCase() === filterType);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Secret Space Management</h1>
          <p className="text-xs text-slate-500 font-medium">Manage private photos, videos, letters, memories, and personal notes.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Private Item</span>
        </button>
      </div>

      {/* Security Info Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-sans">
        🔒 <strong>Privacy Guard:</strong> Uploaded private media is stored securely in private storage and streamed via protected endpoints. Secret Folder authentication is required for viewing.
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        {['ALL', 'PHOTO', 'VIDEO', 'LETTER', 'MEMORY', 'NOTE'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
              filterType === t ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              {item.image || item.imageUrl ? (
                <div className="relative h-44 bg-slate-100">
                  <img src={item.image || item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-slate-900/80 text-white backdrop-blur-md flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{item.type || 'PRIVATE'}</span>
                  </span>
                </div>
              ) : (
                <div className="h-28 bg-slate-50 border-b border-slate-100 p-4 flex flex-col justify-between">
                  <span className="px-2 py-0.5 w-fit rounded-full text-[9px] font-mono font-semibold bg-slate-900 text-white flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{item.type || 'NOTE'}</span>
                  </span>
                  <h4 className="font-serif font-bold text-slate-900 text-base line-clamp-1">{item.title}</h4>
                </div>
              )}

              <div className="p-4 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{item.caption || item.content}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteTargetId(item.id)} className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 text-left border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingItem ? 'Edit Private Item' : 'Add Private Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Category Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="PHOTO">PHOTO (Private Image)</option>
                  <option value="VIDEO">VIDEO (Private Video)</option>
                  <option value="LETTER">LETTER (Private Letter)</option>
                  <option value="MEMORY">MEMORY (Hidden Memory)</option>
                  <option value="NOTE">NOTE (Things I Never Said)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              {/* Private Image Uploader */}
              {(formData.type === 'PHOTO' || formData.type === 'MEMORY' || formData.type === 'NOTE') && (
                <FileUploadZone
                  label="Private Photo Attachment"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  uploadType="private-image"
                  accept="image/*"
                />
              )}

              {/* Private Video Uploader */}
              {formData.type === 'VIDEO' && (
                <FileUploadZone
                  label="Private Video Attachment"
                  value={formData.videoUrl}
                  onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                  uploadType="private-video"
                  accept="video/*"
                />
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Summary</label>
                <textarea
                  rows="2"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300"
                />
              </div>

              {(formData.type === 'LETTER' || formData.type === 'NOTE') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Private Content / Letter Body</label>
                  <textarea
                    rows="5"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 font-serif"
                    placeholder="Write your private message here..."
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-sm">
                  Save Private Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Secret Item?"
        message="Are you sure you want to delete this secret item?"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
