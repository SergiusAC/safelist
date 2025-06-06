import { cryptoUtils } from "@/utils/cryptoUtils";

export const VAULT_VERSION_KEY = "vault_version";
export const SECRET_KEY_SALT = "secret_key_salt";
export const SECRET_KEY_DIGEST = "secret_key_digest";

export const localStorageService = {

  getVaultVersion(): string | null {
    return localStorage.getItem(VAULT_VERSION_KEY);
  },

  setVaultVersion(version: string) {
    return localStorage.setItem(VAULT_VERSION_KEY, version);
  },

  getSecretKeySalt(): ArrayBuffer | null {
    return this._getFromLocalStorageWithBase64Decode(SECRET_KEY_SALT);
  },

  getSecretKeySaltBase64(): string | null {
    return localStorage.getItem(SECRET_KEY_SALT);
  },

  setSecretKeySalt(salt: string) {
    localStorage.setItem(SECRET_KEY_SALT, salt);
  },

  getSecretKeyDigestBase64(): string | null {
    return localStorage.getItem(SECRET_KEY_DIGEST)
  },

  setSecretKeyDigest(digest: string) {
    localStorage.setItem(SECRET_KEY_DIGEST, digest);
  },

  _getFromLocalStorageWithBase64Decode(key: string) {
    const vaultSalt = localStorage.getItem(key);
    if (!vaultSalt) {
      return null;
    }
    return cryptoUtils.base64ToArrayBuffer(vaultSalt);
  },

}