import { cryptoUtils } from "@/utils/cryptoUtils";

export const VAULT_VERSION_KEY = "vault_version";
export const SECRET_KEY_SALT_KEY = "secret_key_salt";
export const SECRET_KEY_DIGEST_KEY = "secret_key_digest";
export const SYNC_SETTINGS_KEY = "sync_settings";

export const localStorageService = {

  getVaultVersion(): string | null {
    return localStorage.getItem(VAULT_VERSION_KEY);
  },

  setVaultVersion(version: string) {
    return localStorage.setItem(VAULT_VERSION_KEY, version);
  },

  getSecretKeySalt(): ArrayBuffer | null {
    return this._getFromLocalStorageWithBase64Decode(SECRET_KEY_SALT_KEY);
  },

  getSecretKeySaltBase64(): string | null {
    return localStorage.getItem(SECRET_KEY_SALT_KEY);
  },

  setSecretKeySalt(salt: string) {
    localStorage.setItem(SECRET_KEY_SALT_KEY, salt);
  },

  getSecretKeyDigestBase64(): string | null {
    return localStorage.getItem(SECRET_KEY_DIGEST_KEY)
  },

  setSecretKeyDigest(digest: string) {
    localStorage.setItem(SECRET_KEY_DIGEST_KEY, digest);
  },

  getSyncSettings() {
    return localStorage.getItem(SYNC_SETTINGS_KEY);
  },

  setSyncSettings(settings: string) {
    localStorage.setItem(SYNC_SETTINGS_KEY, settings);
  },

  _getFromLocalStorageWithBase64Decode(key: string) {
    const vaultSalt = localStorage.getItem(key);
    if (!vaultSalt) {
      return null;
    }
    return cryptoUtils.base64ToArrayBuffer(vaultSalt);
  },

}