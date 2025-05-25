import { base64ToArrayBuffer, decryptText, encryptText } from "@/utils/cryptoUtils";
import type { VaultNoteType, VaultType } from "./types";
import type { EncryptionResult } from "@/utils/types";

export class VaultService {
  
  static VAULT_KEY = "vault";
  static SALT_KEY = "vaultSalt";
  static SECRET_KEY_DIGEST_KEY = "secretKeyDigest";

  /**
   * Get vault from the local storage, decrypt it and return.
   * 
   * @param key secret key for decryption.
   * @returns vault.
   */
  static async loadVault(key: CryptoKey): Promise<VaultType | null> {
    const vaultStr = localStorage.getItem(this.VAULT_KEY);
    if (!vaultStr) {
      return null;
    }
    const vault: EncryptionResult = JSON.parse(vaultStr);
    const vaultDecryptedString = await decryptText(key, vault.ciphertext, vault.iv);
    return JSON.parse(vaultDecryptedString);
  }

  static getEncryptedVault(): EncryptionResult | null {
    const vault = localStorage.getItem(this.VAULT_KEY);
    if (!vault) {
      return null;
    }
    return JSON.parse(vault);
  }

  static async updateVault(key: CryptoKey, item: VaultNoteType) {
    const vault = await this.loadVault(key);
    if (vault === null) {
      const newVault: VaultType = {
        notes: [item],
      }
      this._persistVault(key, newVault);
    } else {
      const currentSecretIdx = vault.notes.findIndex(note => note.id === item.id);
      if (currentSecretIdx > -1 ) {
        vault.notes[currentSecretIdx] = item;
      } else {
        vault.notes.push(item);
      }
      this._persistVault(key, vault);
    }
  }

  static async deleteNote(key: CryptoKey, noteId: string) {
    const vault = await this.loadVault(key);
    if (!vault) {
      return;
    }
    const idx = vault.notes.findIndex(note => note.id === noteId);
    if (idx >= 0) {
      vault.notes.splice(idx, 1);
    }
    this._persistVault(key, vault);
  }

  static findNoteById(vault: VaultType, noteId: string): VaultNoteType | undefined {
    return vault.notes.find(note => note.id === noteId);
  }

  static updateSalt(salt: string) {
    localStorage.setItem(this.SALT_KEY, salt);
  }

  static getSalt(): ArrayBuffer | null {
    return this._getFromLocalStorageWithBase64Decode(this.SALT_KEY);
  }

  static getSaltBase64(): string | null {
    return localStorage.getItem(this.SALT_KEY);
  }

  static updateSecretKeyDigest(digest: string) {
    localStorage.setItem(this.SECRET_KEY_DIGEST_KEY, digest);
  }

  static getSecretKeyDigestBase64(): string | null {
    return localStorage.getItem(this.SECRET_KEY_DIGEST_KEY)
  }

  private static _getFromLocalStorageWithBase64Decode(key: string) {
        const vaultSalt = localStorage.getItem(key);
    if (!vaultSalt) {
      return null;
    }
    return base64ToArrayBuffer(vaultSalt);
  }

  private static async _persistVault(key: CryptoKey, vault: VaultType) {
    const updatedVaultString = JSON.stringify(vault);
    const encryptedVault = await encryptText(key, updatedVaultString);
    localStorage.setItem(this.VAULT_KEY, JSON.stringify(encryptedVault));
  }

}