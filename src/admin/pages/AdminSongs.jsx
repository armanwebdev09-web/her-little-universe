import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Play, Eye, X, Calendar, Clock, Sparkles } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAdminToast } from '../../context/AdminToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { MusicPlayer } from '../../components/MusicPlayer';
import { FileUploadZone } from '../components/FileUploadZone';

export const AdminSongs = () => {
  const { showToast } = useAdminToast();
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    date: '',
    dayNumber: 1,
    cover: '',
    audio: '',
    message: '',
    status: 'Published',
  });

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Song Preview Modal State
  const [previewSong, setPreviewSong] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const fetchSongs = async () => {
    const list = await adminService.getSongs();
    setSongs(list || []);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleOpenAdd = (presetDate = null) => {
    setEditingSong(null);
    setFormData({
      title: '',
      artist: '',
      date: presetDate || new Date().toISOString().split('T')[0],
      dayNumber: songs.length + 1,
      cover: '',
      audio: '',
      message: '',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (song) => {
    setEditingSong(song);
    setFormData({ ...song, cover: song.cover || song.coverUrl || '', audio: song.audio || song.audioUrl || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminService.saveSong(editingSong ? { ...formData, id: editingSong.id } : formData);
    showToast(editingSong ? 'Song updated successfully' : 'New song added');
    setIsModalOpen(false);
    fetchSongs();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await adminService.deleteSong(deleteTargetId);
    showToast('Song deleted', 'error');
    setDeleteTargetId(null);
    fetchSongs();
  };

  const filteredSongs = songs.filter((song) => {
    const matchesFilter = filter === 'ALL' || (song.status && song.status.toUpperCase() === filter);
    const matchesSearch =
      (song.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (song.artist || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Songs</h1>
          <p className="text-xs text-slate-500 font-medium">Manage and schedule songs for her soundtrack.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Calendar Schedule
            </button>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Song</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PUBLISHED', 'SCHEDULED', 'DRAFT'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
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
            placeholder="Search songs..."
            className="py-1.5 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Calendar Overview View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Schedule Overview</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Asia/Kolkata Timezone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {songs.map((s) => (
              <div
                key={s.id}
                onClick={() => handleOpenEdit(s)}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-slate-900">{s.date}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    {s.countdownText || 'Available'}
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {s.cover || s.coverUrl ? (
                    <img src={s.cover || s.coverUrl} alt={s.title} className="w-9 h-9 rounded-lg object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                      ♪
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{s.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{s.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Song Details</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Countdown / Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 italic">
                    No songs in database yet. Click "+ Add Song" to add your first real song.
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{song.dayNumber || song.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {song.cover || song.coverUrl ? (
                          <img src={song.cover || song.coverUrl} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
                            ♪
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-slate-900 block">{song.title}</span>
                          <span className="text-slate-500 text-[11px]">{song.artist}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{song.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {song.countdownText || song.status || 'Published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setPreviewSong(song);
                          setIsPreviewPlaying(false);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(song)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(song.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
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

      {/* Mobile Card List View */}
      {viewMode === 'table' && (
        <div className="md:hidden space-y-3">
          {filteredSongs.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-200">
              No songs in database yet. Click "+ Add Song" to add your first real song.
            </div>
          ) : (
            filteredSongs.map((song) => (
              <div key={song.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Day #{song.dayNumber || song.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {song.countdownText || song.status || 'Published'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {song.cover || song.coverUrl ? (
                    <img src={song.cover || song.coverUrl} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-base">
                      ♪
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{song.title}</h4>
                    <p className="text-xs text-slate-500">{song.artist}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">{song.date}</span>
                  <div className="space-x-2">
                    <button onClick={() => setPreviewSong(song)} className="p-1 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenEdit(song)} className="p-1 text-slate-500">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTargetId(song.id)} className="p-1 text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
              {editingSong ? 'Edit Song' : 'Add New Song'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Song Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Khat"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Artist</label>
                  <input
                    type="text"
                    value={formData.artist}
                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                    required
                    placeholder="e.g. Personal Soundtrack"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Release Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    placeholder="YYYY-MM-DD"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Day Number</label>
                  <input
                    type="number"
                    value={formData.dayNumber}
                    onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) })}
                    required
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* Cover Image Uploader */}
              <FileUploadZone
                label="Cover Image"
                value={formData.cover}
                onChange={(url) => setFormData({ ...formData, cover: url })}
                uploadType="image"
                accept="image/*"
              />

              {/* Audio File Uploader */}
              <FileUploadZone
                label="Audio File"
                value={formData.audio}
                onChange={(url) => setFormData({ ...formData, audio: url })}
                uploadType="audio"
                accept="audio/*"
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Message</label>
                <textarea
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Why did you pick this song?"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold shadow-sm hover:bg-slate-800 cursor-pointer">
                  Save Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Song Preview Modal */}
      {previewSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewSong(null)} />
          <div className="relative w-full max-w-2xl bg-[#080B16] rounded-3xl p-6 border border-[#D9A6B2]/30 shadow-2xl z-10">
            <button onClick={() => setPreviewSong(null)} className="absolute top-4 right-4 p-2 text-[#B8B6C4] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4 text-center">
              <span className="text-[10px] font-mono text-[#D8B477] uppercase tracking-widest font-semibold block mb-1">
                ADMIN PREVIEW MODE
              </span>
              <h3 className="text-xl font-serif text-white">{previewSong.title}</h3>
            </div>
            <MusicPlayer song={previewSong} isPlaying={isPreviewPlaying} onTogglePlay={() => setIsPreviewPlaying(!isPreviewPlaying)} />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Song?"
        message="Are you sure you want to delete this song? It will be removed from the soundtrack schedule."
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
