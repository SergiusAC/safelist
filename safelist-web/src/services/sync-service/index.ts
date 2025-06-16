import { localStorageService } from "@/storage/local-storage/localStorageService"
import { yandexDiskService } from "./yandex-disk-service";
import { exportService } from "../export-service";
import type { DropboxSyncSettingsType, SyncSettingsType, YandexDiskSyncSettingsType } from "./types";
import { cryptoUtils } from "@/utils/cryptoUtils";
import type { EncryptionResult } from "@/utils/types";
import { stringUtils } from "@/utils/stringUtils";
import { dropboxService } from "./dropbox-service";

export const syncService = {

  async addSyncWithYandexDisk(key: CryptoKey, settings: YandexDiskSyncSettingsType) {
    const currentSettings = await this._loadSettings(key);
    if (currentSettings === null) {
      const newSettings: SyncSettingsType = {
        yandexDisk: settings,
        dropbox: null
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

  async addSyncWithDropbox(key: CryptoKey, settings: DropboxSyncSettingsType) {
    const currentSettings = await this._loadSettings(key);
    if (currentSettings === null) {
      const newSettings: SyncSettingsType = {
        yandexDisk: null,
        dropbox: settings
      }
      await this._persistSettings(key, newSettings);
    } else {
      currentSettings.dropbox = settings;
      await this._persistSettings(key, currentSettings);
    }
  },

  async deleteSyncWithDropbox(key: CryptoKey) {
    const currentSettings = await this._loadSettings(key);
    if (currentSettings !== null) {
      currentSettings.dropbox = null;
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
    if (stringUtils.isNotBlank(settings.yandexDisk?.token)) {
      await this._startSyncWithYandexDisk(settings.yandexDisk!);
    }
    if (stringUtils.isNotBlank(settings.dropbox?.accessToken) && stringUtils.isNotBlank(settings.dropbox?.refreshToken)) {
      await this._startSyncWithDropbox(key, settings.dropbox!);
    }
  },

  async _startSyncWithYandexDisk(settings: YandexDiskSyncSettingsType) {
    const yandexToken = settings.token;
    const backupsExists = await yandexDiskService.backupsExists(yandexToken);
    if (!backupsExists) {
      await yandexDiskService.createBackupsFolder(yandexToken);
    }
    const objectForExport = await exportService.getEncryptedVault();
    await yandexDiskService.createBackup(yandexToken, JSON.stringify(objectForExport, null, 2));
  },

  async _startSyncWithDropbox(key: CryptoKey, settings: DropboxSyncSettingsType) {
    const dbxAuth = await dropboxService.checkAndRefreshAccessToken(settings);
    const objectForExport = await exportService.getEncryptedVault();
    await dropboxService.uploadFile(
      dbxAuth.getAccessToken(), 
      "/backups/vault.json", 
      JSON.stringify(objectForExport, null, 2)
    );
    // update Dropbox settings, if the access_token was refreshed
    if (dbxAuth.getAccessToken() !== settings.accessToken) {
      console.log("dropbox access_token refreshed");
      settings.accessToken = dbxAuth.getAccessToken();
      settings.accessTokenExpiresAt = dbxAuth.getAccessTokenExpiresAt().getTime();
      await this.addSyncWithDropbox(key, settings);
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