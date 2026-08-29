import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import secretRoutes from './routes/secret.routes.js';
import mediaRoutes from './routes/media.routes.js';
import songsRoutes from './routes/songs.routes.js';
import memoriesRoutes from './routes/memories.routes.js';
import lettersRoutes from './routes/letters.routes.js';
import quotesRoutes from './routes/quotes.routes.js';
import universeRoutes from './routes/universe.routes.js';
import birthdayRoutes from './routes/birthday.routes.js';
import surprisesRoutes from './routes/surprises.routes.js';
import storyRoutes from './routes/story.routes.js';
import littleThingsRoutes from './routes/littleThings.routes.js';
import activityRoutes from './routes/activity.routes.js';

import { errorMiddleware } from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security Headers - Configure crossOriginResourcePolicy for public media serving
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Flexible CORS Configuration for Production Vercel & Local Dev
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        FRONTEND_URL,
        'https://her-little-universe-five.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// Serve Public Uploads statically for dev fallback
app.use('/uploads/public', express.static(path.join(process.cwd(), 'uploads', 'public')));

// Body Parsing & Cookies
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting for Authentication Endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authRateLimiter);
app.use('/api/secret/unlock', authRateLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Her Little Universe API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/secret', secretRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/letters', lettersRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/universe', universeRoutes);
app.use('/api/birthday', birthdayRoutes);
app.use('/api/surprises', surprisesRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/little-things', littleThingsRoutes);
app.use('/api/activity', activityRoutes);

// Centralized Error Handler
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Her Little Universe API running on http://localhost:${PORT}`);
});

export default app;
