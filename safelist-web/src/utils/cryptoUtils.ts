import type { EncryptionResult } from "./types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function deriveSecretKey(masterPassword: string, passwordSalt: ArrayBuffer): Promise<CryptoKey> {
  const masterPasswordRawKey = await crypto.subtle.importKey(
    "raw", 
    textEncoder.encode(masterPassword), 
    { name: "PBKDF2" }, 
    false, 
    ["deriveKey"]
  );
  const derivedKey = await crypto.subtle.deriveKey(
    { 
      name: "PBKDF2",
      salt: passwordSalt, 
      iterations: 100000,
      hash: "SHA-256" 
    },
    masterPasswordRawKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return derivedKey;
}

export async function encryptText(key: CryptoKey, text: string): Promise<EncryptionResult> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    textEncoder.encode(text)
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv)
  };
}


export async function decryptText(key: CryptoKey, ciphertext: string, iv: string): Promise<string> {
  const ciphertextBytes = base64ToArrayBuffer(ciphertext);
  const ivBytes = base64ToArrayBuffer(iv);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBytes
    },
    key,
    ciphertextBytes
  );

  return textDecoder.decode(decrypted);
}

export async function importKey(rawKey: ArrayBuffer) {
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "PBKDF2" },
    true,
    ["encrypt", "decrypt"]
  )
}

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey('raw', key);
}

export function generateSalt(): ArrayBuffer {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function generateSaltAsBase64(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...salt));
}

export async function digestAsBase64(message: ArrayBuffer | DataView): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-512", message);
  return arrayBufferToBase64(digest);
}

export function arrayBufferToBase64(arr: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(arr)));
}

export function base64ToArrayBuffer(base64String: string): ArrayBuffer {
  return Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
}
