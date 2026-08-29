import { storageService } from '../utils/storage.js';
import { logActivity } from '../utils/activityLogger.js';

let mediaAssetsStore = [];

export const uploadPublicImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileResult = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      visibility: 'PUBLIC',
      mediaType: 'IMAGE',
    });

    const asset = {
      id: 'asset-' + Date.now(),
      ...fileResult,
      createdAt: new Date().toISOString(),
    };

    mediaAssetsStore.push(asset);
    await logActivity('UPLOAD_MEDIA', 'MediaAsset', asset.id);

    return res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded' });
    }

    const fileResult = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      visibility: 'PUBLIC',
      mediaType: 'AUDIO',
    });

    const asset = {
      id: 'asset-' + Date.now(),
      ...fileResult,
      createdAt: new Date().toISOString(),
    };

    mediaAssetsStore.push(asset);
    await logActivity('UPLOAD_MEDIA', 'MediaAsset', asset.id);

    return res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadPrivateImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const fileResult = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      visibility: 'PRIVATE',
      mediaType: 'IMAGE',
    });

    const assetId = 'asset-priv-' + Date.now();
    const asset = {
      id: assetId,
      ...fileResult,
      url: `/api/secret/media/${assetId}`,
      createdAt: new Date().toISOString(),
    };

    mediaAssetsStore.push(asset);
    await logActivity('UPLOAD_PRIVATE_MEDIA', 'MediaAsset', asset.id);

    return res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (err) {
    next(err);
  }
};

export const uploadPrivateVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    const fileResult = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      visibility: 'PRIVATE',
      mediaType: 'VIDEO',
    });

    const assetId = 'asset-priv-' + Date.now();
    const asset = {
      id: assetId,
      ...fileResult,
      url: `/api/secret/media/${assetId}`,
      createdAt: new Date().toISOString(),
    };

    mediaAssetsStore.push(asset);
    await logActivity('UPLOAD_PRIVATE_MEDIA', 'MediaAsset', asset.id);

    return res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMediaAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assetIndex = mediaAssetsStore.findIndex((a) => a.id === id);

    if (assetIndex !== -1) {
      const asset = mediaAssetsStore[assetIndex];
      await storageService.deleteFile(asset.storageKey);
      mediaAssetsStore.splice(assetIndex, 1);
    }

    await logActivity('DELETE_MEDIA', 'MediaAsset', id);
    return res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getPrivateMediaAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Set non-cacheable security headers to prevent public CDN/proxy caching
    res.setHeader('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const asset = mediaAssetsStore.find((a) => a.id === id);

    if (!asset || asset.visibility !== 'PRIVATE') {
      return res.status(404).json({ success: false, message: 'Private media asset not found' });
    }

    const filePath = storageService.getPrivateFilePath(asset.storageKey);
    if (!filePath) {
      return res.status(404).json({ success: false, message: 'File not found in storage' });
    }

    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};
