/**
 * HER LITTLE UNIVERSE - FRONTEND MEDIA SERVICE
 */

let rawBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/$/, '');
if (!rawBase.endsWith('/api')) {
  rawBase += '/api';
}
const API_BASE_URL = rawBase;

async function uploadFile(endpoint, file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Media upload failed');
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const mediaService = {
  // Public Media Uploads
  uploadImage: (file) => uploadFile('/media/images', file),
  uploadAudio: (file) => uploadFile('/media/audio', file),

  // Private Media Uploads
  uploadPrivateImage: (file) => uploadFile('/secret/media/images', file),
  uploadPrivateVideo: (file) => uploadFile('/secret/media/videos', file),

  // Delete Media Asset
  deleteMedia: async (id) => {
    const res = await fetch(`${API_BASE_URL}/media/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  // Protected Private Media URL generator
  getPrivateMediaUrl: (id) => `${API_BASE_URL}/secret/media/${id}`,
};
