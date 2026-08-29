import multer from 'multer';

const memoryStorage = multer.memoryStorage();

// Image upload filter (10MB limit)
export const uploadImageMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Allowed: JPEG, PNG, WebP, GIF'), false);
    }
  },
}).single('file');

// Audio upload filter (25MB limit)
export const uploadAudioMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/x-m4a'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|m4a|wav|ogg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type. Allowed: MP3, M4A, WAV, OGG'), false);
    }
  },
}).single('file');

// Video upload filter (100MB limit)
export const uploadVideoMiddleware = multer({
  storage: memoryStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp4|webm|mov)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video file type. Allowed: MP4, WebM, MOV'), false);
    }
  },
}).single('file');
