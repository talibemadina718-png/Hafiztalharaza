# Private Admin Setup & Architecture Guide
**Owner:** Hafiz Talha Raza Attari  
**Project:** Online Quran & Madani Qaida Academy Portfolio

---

## 1. Security Overview

The website features a **Private Custom Website Editor** designed exclusively for the website owner. Unlike superficial client-side mockups, this editor is secured with genuine server-side authentication:

- **Server-Side Authentication:** Protected via bcrypt-hashed credentials and cryptographically generated HTTP-only session cookies.
- **Hidden from Visitors:** Regular visitors never see the editor button, admin toolbar, or editing controls.
- **Protected APIs:** Content publishing (`/api/admin/save-content`) and image uploads (`/api/admin/upload-image`) are guarded by strict authorization middleware that rejects unauthorized requests with HTTP `401 Unauthorized`.
- **Zero Secrets in Frontend:** Passwords, hashes, and signing keys are never bundled into client JavaScript.

---

## 2. Quick Start to Launch the Secure Backend

1. **Install Node.js:**  
   If Node.js is not already installed on your machine or server, download it from [nodejs.org](https://nodejs.org/).

2. **Install Dependencies:**
   ```bash
   cd "C:\Users\IT POINT\Desktop\Notebook Prompt"
   npm install
   ```

3. **Start the Secure Server:**
   ```bash
   npm start
   ```
   Or for live auto-reloading during development:
   ```bash
   npm run dev
   ```

4. **Access the Website:**  
   Open your browser and navigate to `http://localhost:3000`.

---

## 3. How to Access the Private Admin Editor

1. Open the website at `http://localhost:3000`.
2. Scroll to the footer and click the subtle **🔒 Admin** link, or press the keyboard shortcut:
   - **Windows / Linux:** `Ctrl + Alt + A`
   - **Mac:** `Cmd + Option + A`
3. Enter your administrator credentials in the secure login modal:
   - **Default Username:** `admin`
   - **Default Password:** `TalhaAdmin@2026!`
4. Upon successful login:
   - The private **Live Admin Editor Toolbar** and **Drawer** appear.
   - You can edit every section, heading, text, button, link, image, logo, color, font, and animation setting with instant live preview.
   - Clicking **"Save & Publish"** saves your changes permanently to disk on the server (`data/site-content.json`).
   - Clicking **"Logout"** terminates your session and immediately conceals the editor.

---

## 4. Customizing Admin Credentials

To change your username, password, or session secret, set the following environment variables or edit `server.js`:

```bash
# In your terminal or production environment:
export ADMIN_USERNAME="hafiztalha"
export ADMIN_PASSWORD_HASH="<your_bcrypt_hash>"
export SESSION_SECRET="<a_long_random_secret_string>"
```

To generate a new bcrypt password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewPasswordHere', 10))"
```
