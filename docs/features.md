# Features

## 🔐 Master Password Authentication
- A secure key is derived from the Master Password using **PBKDF2** with a randomly generated salt.
- Only the **salt** and a **cryptographic digest** of the derived key are stored for login verification — the actual password is never saved.

## ✍️ Folder-Based Note Management
- Create, edit, delete notes.
- Organize with folders and nested structures.

## 🗃️ Local Storage with IndexedDB
- All data is stored securely in the browser.
- Supports working fully offline.

## ☁️ Encrypted sync with cloud drives
- Sync encrypted data to the cloud drives (Dropbox, Yandex Disk).

## 🔄 Import / Export
- Full backups of notes and structure.
- Can be decrypted and restored on any device.

## 🛡️ Zero-Knowledge Architecture
- No plaintext leaves your device.
- No server required.
