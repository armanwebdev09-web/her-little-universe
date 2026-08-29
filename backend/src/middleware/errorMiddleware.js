/**
 * Centralized Error Middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    console.error('API Error:', err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(isDev && { stack: err.stack }),
  });
};
