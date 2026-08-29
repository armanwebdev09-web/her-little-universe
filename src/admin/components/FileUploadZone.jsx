import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, File, Image as ImageIcon, Music, Video } from 'lucide-react';
import { mediaService } from '../../services/mediaService';

export const FileUploadZone = ({
  label = "Upload File",
  value = "",
  onChange,
  uploadType = "image", // "image" | "audio" | "private-image" | "private-video"
  accept = "image/*",
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(value);
  const [fileDetails, setFileDetails] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    setError(null);
    setUploading(true);

    // Create local Object URL preview
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }

    setFileDetails({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });

    try {
      let res;
      if (uploadType === 'image') {
        res = await mediaService.uploadImage(file);
      } else if (uploadType === 'audio') {
        res = await mediaService.uploadAudio(file);
      } else if (uploadType === 'private-image') {
        res = await mediaService.uploadPrivateImage(file);
      } else if (uploadType === 'private-video') {
        res = await mediaService.uploadPrivateVideo(file);
      }

      setUploading(false);
      if (res && res.success && res.data) {
        const finalUrl = res.data.url || res.data.storageKey;
        onChange(finalUrl);
      } else {
        // Fallback for dev local Object URL
        const fallbackUrl = URL.createObjectURL(file);
        onChange(fallbackUrl);
      }
    } catch (err) {
      setUploading(false);
      // Fallback dev preview URL if API server is not running
      const fallbackUrl = URL.createObjectURL(file);
      setPreviewUrl(fallbackUrl);
      onChange(fallbackUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setPreviewUrl('');
    setFileDetails(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-xs font-sans">
      <label className="block font-semibold text-slate-700">{label}</label>

      {/* File Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging ? 'border-rose-500 bg-rose-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          className="hidden"
        />

        {uploading ? (
          <div className="py-3 flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-600 font-medium">Uploading...</span>
          </div>
        ) : (previewUrl || value) ? (
          <div className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-3 overflow-hidden">
              {uploadType.includes('image') && (previewUrl || value) ? (
                <img src={previewUrl || value} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
              ) : uploadType === 'audio' ? (
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Music className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
              )}

              <div className="text-left overflow-hidden">
                <span className="font-semibold text-slate-800 line-clamp-1 text-xs">
                  {fileDetails ? fileDetails.name : 'Uploaded Media'}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-medium flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>✓ Ready</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-2 space-y-1">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              Drag & drop file here, or <span className="text-rose-600 font-semibold underline">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Max size: {uploadType === 'video' ? '100MB' : uploadType === 'audio' ? '25MB' : '10MB'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-600 font-medium flex items-center space-x-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
