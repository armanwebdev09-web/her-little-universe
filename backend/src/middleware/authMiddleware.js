import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-super-secret-key-change-me-in-production';

/**
 * Middleware requiring valid Admin Authentication cookie (admin_token)
 */
export const requireAdminAuth = (req, res, next) => {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }
};

/**
 * Middleware requiring valid Secret Access cookie (secret_token)
 */
export const requireSecretAuth = (req, res, next) => {
  try {
    const token = req.cookies?.secret_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Secret Space is locked',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'secret_guest') {
      return res.status(401).json({
        success: false,
        message: 'Secret Space is locked',
      });
    }

    req.secretSession = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Secret Space is locked',
    });
  }
};
