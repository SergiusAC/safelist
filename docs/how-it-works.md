# How It Works

## Master Password Flow
1. User sets a Master Password.
2. The app derives a key using **PBKDF2**.
3. The digest of the derived key is stored in **LocalStorage**.
4. On login, the derived key is verified using the digest.

## Note Encryption
- Notes are encrypted using **AES-GCM**.
- A unique IV is used per encryption.
- Encryption and decryption happen **client-side**.

## Folder Structure
- Organize your notes in folder-like structure.

## Data Lifecycle
- Notes and folders are edited in-memory.
- Changes are encrypted and saved to **IndexedDB**.
