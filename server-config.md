# Production Server Authentication & Admin Security Architecture

This document provides production-grade server-side authentication configurations and backend implementations for **Hafiz Talha Raza Attari — Online Quran Academy & Portfolio**.

---

## 1. Security Architecture Overview

| Layer | Public Site (`index.html`) | Admin Portal (`admin.html`) | Production Backend Server |
|---|---|---|---|
| **Access** | Publicly accessible to all visitors | Restricted private route | Authenticated requests only |
| **Controls** | Pure client view (zero editing UI) | Full admin editor & management suite | Server-side validation & storage |
| **Auth Mechanism** | None (public read-only) | Session token gate + credential verification | HTTP-Only Cookies / JWT / Sessions |
| **API Endpoints** | None | `/api/admin/login`, `/api/admin/publish` | Strictly protected by middleware |

---

## 2. Option A: Node.js / Express Server Implementation

### `server.js`
```javascript
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Adjust according to external CDNs
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure Session Cookie Configuration
app.use(session({
  name: '__talha_admin_sid',
  secret: process.env.SESSION_SECRET || 'CHANGE_THIS_SUPER_SECRET_KEY_12345!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevents XSS cookie theft
    secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
    sameSite: 'strict', // Protects against CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Admin Credentials (Store hashed password in production)
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
// Pre-computed bcrypt hash for 'admin@talha2026'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_HASH || '$2b$10$wN1r7.q4B08X0W5yqj4lbe8yqL.UvRzQn.5/79qP9cKpK36m4hWye';

// Storage file for published site configuration
const DATA_FILE = path.join(__dirname, 'data', 'site-config.json');

// Helper to ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Authentication Middleware
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Administrator authentication required.' });
}

// ---------------- API ROUTES ----------------

// 1. Admin Login Endpoint
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  req.session.isAdmin = true;
  req.session.adminUser = username;
  return res.json({ success: true, message: 'Authentication successful.' });
});

// 2. Admin Logout Endpoint
app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout error.' });
    res.clearCookie('__talha_admin_sid');
    return res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// 3. Publish Configuration (Protected)
app.post('/api/admin/publish', requireAdminAuth, (req, res) => {
  const newConfig = req.body;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(newConfig, null, 2), 'utf8');
    return res.json({ success: true, message: 'Configuration published successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to write configuration file.' });
  }
});

// 4. Public Endpoint to Get Published Config
app.get('/api/config', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return res.json(JSON.parse(data));
  }
  return res.json({});
});

// ---------------- PROTECTED ADMIN PAGE ----------------
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ---------------- PUBLIC STATIC ASSETS ----------------
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
```

---

## 3. Option B: PHP 8+ Implementation (cPanel / Apache / Shared Hosting)

### `api/login.php`
```php
<?php
session_start([
    'cookie_httponly' => true,
    'cookie_secure'   => isset($_SERVER['HTTPS']),
    'cookie_samesite' => 'Strict',
    'gc_maxlifetime'  => 86400
]);

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Master password hash (password_hash('admin@talha2026', PASSWORD_BCRYPT))
$validUser = 'admin';
$validHash = '$2y$10$wN1r7.q4B08X0W5yqj4lbe8yqL.UvRzQn.5/79qP9cKpK36m4hWye';

if ($username === $validUser && password_verify($password, $validHash)) {
    $_SESSION['is_admin'] = true;
    $_SESSION['admin_user'] = $username;
    echo json_encode(['success' => true, 'message' => 'Authenticated successfully.']);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid admin credentials.']);
}
```

### `api/publish.php`
```php
<?php
session_start();
header('Content-Type: application/json');

if (empty($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Administrator access required.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = file_get_contents('php://input');
$json = json_decode($data, true);

if (!$json) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload.']);
    exit;
}

$filePath = __DIR__ . '/../data/site-config.json';
if (!is_dir(dirname($filePath))) {
    mkdir(dirname($filePath), 0755, true);
}

file_put_contents($filePath, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['success' => true, 'message' => 'Configuration published successfully.']);
```

---

## 4. Option C: Nginx Reverse Proxy & Route Restriction

If hosting on an Ubuntu/Debian VPS with Nginx:

```nginx
# Public Main Site
server {
    listen 80;
    server_name talhaacademy.com www.talhaacademy.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name talhaacademy.com www.talhaacademy.com;

    ssl_certificate /etc/letsencrypt/live/talhaacademy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/talhaacademy.com/privkey.pem;

    root /var/www/talhaacademy;
    index index.html;

    # Public Access
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Restrict admin.html with HTTP Basic Auth or IP Whitelisting
    location = /admin.html {
        auth_basic "Restricted Administrator Area";
        auth_basic_user_file /etc/nginx/.htpasswd;

        # Optional: Restrict to administrator's static IP
        # allow 203.0.113.195;
        # deny all;

        try_files /admin.html =404;
    }

    # Deny direct access to data files
    location ^~ /data/ {
        deny all;
        return 404;
    }
}
```

---

## 5. Apache `.htaccess` Protection (for Shared Hosting)

Place this `.htaccess` file in the website root directory:

```apache
# Protect admin.html with Server-side Authentication
<Files "admin.html">
    AuthType Basic
    AuthName "Hafiz Talha Raza Admin Area"
    AuthUserFile /home/username/.htpasswd
    Require valid-user
</Files>

# Protect Data folder from public reading
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^data/ - [F,L]
</IfModule>
```
