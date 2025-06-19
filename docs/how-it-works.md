# How It Works

## Master Password Flow
1. The user creates a **Master Password**.
2. A **random salt** is generated for secure key derivation.
3. Using **PBKDF2**, a cryptographic key is derived from the Master Password and the salt.
4. A **digest** of the derived key, along with the salt, is stored securely in **LocalStorage**.
5. During login, the app re-derives the key and verifies it against the stored digest and salt to authenticate the user.

## Note Encryption
- Notes are encrypted and decrypted entirely **on the client side**.
- The encryption algorithm used is **AES-GCM**, ensuring both confidentiality and integrity.
- A **unique initialization vector (IV)** is generated for each encryption operation to enhance security.

## Folder Structure
- Notes can be organized using a **folder-like hierarchy** for better structure and navigation.

## Data Lifecycle
- Notes and folders are managed **in-memory** during active sessions.
- All changes are **encrypted and persisted** in the browser's **IndexedDB**.
- If synchronization is enabled, encrypted data is **automatically synced** with configured cloud storage providers (Dropbox and/or Yandex Disk).
