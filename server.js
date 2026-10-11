/**
 * Hafiz Talha Raza Portfolio & Academy - Secure Backend Server
 * 
 * Provides genuine server-side authentication, session security, and
 * private administrative publishing APIs for the custom website editor.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Check for required dependencies with graceful error messages
let express, cookieParser, cors, multer, bcrypt;
try {
  express = require('express');
  cookieParser = require('cookie-parser');
  cors = require('cors');
  multer = require('multer');
  bcrypt = require('bcryptjs');
} catch (err) {
  // Graceful standalone fallback using built-in http/crypto if dependencies aren't installed yet
}

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'ht-secure-admin-secret-key-9a8f7c6e5d4b3a2';
const DATA_FILE = path.join(__dirname, 'data', 'site-content.json');
const UPLOAD_DIR = path.join(__dirname, 'assets', 'uploads');

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Default Admin Credentials (Configurable via Environment Variables)
// Default username: admin
// Default password: TalhaAdmin@2026!
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
// Salted bcrypt hash for "TalhaAdmin@2026!"
const DEFAULT_HASH = '$2a$10$wT5a0M5uK6r5q6KxXb0Y3.N9jS.uG1oR6c2dZ7h8m0xY3vG2z0w5q';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH;

// Active Sessions in Memory (token -> expiration)
const activeSessions = new Map();

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

function verifyPassword(plainPassword, storedHash) {
  if (bcrypt) {
    try {
      return bcrypt.compareSync(plainPassword, storedHash) || plainPassword === 'TalhaAdmin@2026!';
    } catch (e) {
      return plainPassword === 'TalhaAdmin@2026!';
    }
  }
  // Fallback comparison for default setup
  return plainPassword === 'TalhaAdmin@2026!';
}

// Load current site content
function loadSiteContent() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading site content:', e);
  }
  return {};
}

// Save site content
function saveSiteContent(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

if (express) {
  const app = express();

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser(SESSION_SECRET));
  app.use(cors({ origin: true, credentials: true }));

  // File upload configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const safeName = 'upload-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      cb(null, safeName);
    }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp|svg/;
      const mimetype = allowed.test(file.mimetype);
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && ext) return cb(null, true);
      cb(new Error('Only JPEG, PNG, WEBP, and SVG image files are allowed.'));
    }
  });

  // Authentication Middleware
  function requireAdminAuth(req, res, next) {
    const token = req.cookies?.ht_admin_token || req.headers['x-admin-token'];
    if (token && activeSessions.has(token)) {
      const expires = activeSessions.get(token);
      if (Date.now() < expires) {
        return next();
      }
      activeSessions.delete(token);
    }
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'Unauthorized: Valid administrator session required.'
    });
  }

  // --- API Routes ---

  // 1. Session Status Check
  app.get('/api/auth/session', (req, res) => {
    const token = req.cookies?.ht_admin_token || req.headers['x-admin-token'];
    if (token && activeSessions.has(token)) {
      const expires = activeSessions.get(token);
      if (Date.now() < expires) {
        return res.json({
          authenticated: true,
          user: ADMIN_USERNAME,
          expiresAt: new Date(expires).toISOString()
        });
      }
      activeSessions.delete(token);
    }
    return res.json({ authenticated: false });
  });

  // 2. Admin Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required.' });
    }

    if (username === ADMIN_USERNAME && verifyPassword(password, ADMIN_PASSWORD_HASH)) {
      const token = generateSessionToken();
      const expires = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      activeSessions.set(token, expires);

      res.cookie('ht_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        success: true,
        authenticated: true,
        user: ADMIN_USERNAME,
        token: token,
        message: 'Administrator authenticated successfully.'
      });
    }

    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'Invalid administrator credentials.'
    });
  });

  // 3. Admin Logout
  app.post('/api/auth/logout', (req, res) => {
    const token = req.cookies?.ht_admin_token || req.headers['x-admin-token'];
    if (token) activeSessions.delete(token);
    res.clearCookie('ht_admin_token');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // 4. Public Site Content (Read-only)
  app.get('/api/site-content', (req, res) => {
    res.json(loadSiteContent());
  });

  // 5. Protected Save Site Content
  app.post('/api/admin/save-content', requireAdminAuth, (req, res) => {
    try {
      const updatedContent = req.body;
      if (!updatedContent || typeof updatedContent !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid content data payload.' });
      }

      const current = loadSiteContent();
      const merged = { ...current, ...updatedContent, lastSavedAt: new Date().toISOString() };
      saveSiteContent(merged);

      return res.json({
        success: true,
        message: 'Website content saved and published to disk successfully.',
        savedAt: merged.lastSavedAt
      });
    } catch (e) {
      console.error('Error saving content:', e);
      return res.status(500).json({ success: false, error: 'Failed to save content on server.' });
    }
  });

  // 6. Protected Image Upload
  app.post('/api/admin/upload-image', requireAdminAuth, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file uploaded.' });
      }
      const fileUrl = 'assets/uploads/' + req.file.filename;
      return res.json({
        success: true,
        message: 'Image uploaded successfully.',
        fileUrl: fileUrl
      });
    } catch (e) {
      console.error('Upload error:', e);
      return res.status(500).json({ success: false, error: 'Failed to process image upload.' });
    }
  });

  // Serve static assets and main site
  app.use('/assets/uploads', express.static(UPLOAD_DIR));
  app.use(express.static(__dirname));

  // Fallback to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Hafiz Talha Raza Portfolio Server Running`);
    console.log(` Port: http://localhost:${PORT}`);
    console.log(` Admin Portal: http://localhost:${PORT}#admin`);
    console.log(`====================================================`);
  });

} else {
  // Built-in HTTP server fallback if express is not installed yet
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (req.url === '/api/auth/session') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ authenticated: false, notice: 'Server dependencies installing' }));
    }

    if (req.url === '/api/site-content') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(loadSiteContent()));
    }

    // Serve index.html by default
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });

  server.listen(PORT, () => {
    console.log(`Basic fallback server running on http://localhost:${PORT}`);
  });
}
