import { localStorageService } from "@/storage/local-storage/localStorageService"
import { yandexDiskService } from "./yandex-disk-service";
import { exportService } from "../export-service";
import type { SyncSettingsType, YandexDiskSyncSettingsType } from "./types";
import { cryptoUtils } from "@/utils/cryptoUtils";
import type { EncryptionResult } from "@/utils/types";

export const syncService = {

  async addSyncWithYandexDisk(key: CryptoKey, settings: YandexDiskSyncSettingsType) {
    const currentSettings = await this._loadSettings(key);
    if (currentSettings === null) {
      const newSettings: SyncSettingsType = {
        yandexDisk: settings
      }
      await this._persistSettings(key, newSettings);
    } else {
      currentSettings.yandexDisk = settings;
      await this._persistSettings(key, currentSettings);
    }
  },

  async deleteSyncWithYandexDisk(key: CryptoKey) {
    const currentSettings = await this._loadSettings(key);
    if (currentSettings !== null) {
      currentSettings.yandexDisk = null;
      await this._persistSettings(key, currentSettings);
    }
  },

  async getSyncSettings(key: CryptoKey): Promise<SyncSettingsType | null> {
    return await this._loadSettings(key);
  },

  async startSync(key: CryptoKey) {
    const settings = await this._loadSettings(key);
    if (!settings) {
      console.log("Sync not enabled");
      return;
    }
    if (settings.yandexDisk?.token && settings.yandexDisk.token.trim().length > 0) {
      const objectForExport = await exportService.getEncryptedVault();
      await yandexDiskService.createBackup(settings.yandexDisk?.token, JSON.stringify(objectForExport, null, 2));
    }
  },

  async _loadSettings(key: CryptoKey): Promise<SyncSettingsType | null> {
    const syncSettingsString = localStorageService.getSyncSettings();
    if (syncSettingsString === null) {
      return null;
    }
    const syncSettingsEncrypted: EncryptionResult = JSON.parse(syncSettingsString);
    const settingsDecrypted = await cryptoUtils.decryptText(key, syncSettingsEncrypted.ciphertext, syncSettingsEncrypted.iv);
    return JSON.parse(settingsDecrypted);
  },

  async _persistSettings(key: CryptoKey, settings: SyncSettingsType) {
    const settingsString = JSON.stringify(settings);
    const settingsEncrypted = await cryptoUtils.encryptText(key, settingsString);
    localStorageService.setSyncSettings(JSON.stringify(settingsEncrypted));
  },

}