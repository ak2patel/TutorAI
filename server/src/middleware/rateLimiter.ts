import rateLimit from 'express-rate-limit';

// ============================================
// Rate Limiter Middleware
// Protects API from abuse (100 requests per 15 min window)
// ============================================

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

// Stricter limit for AI generation endpoints
export const generationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many generation requests. Please wait before trying again.',
  },
});
