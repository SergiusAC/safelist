export interface SyncSettingsType {
  yandexDisk: YandexDiskSyncSettingsType | null;
  dropbox: DropboxSyncSettingsType | null;
}

export interface YandexDiskSyncSettingsType {
  id: string;
  token: string;
  expiresAt: number;
  enabled: boolean;
}

export interface DropboxSyncSettingsType {
  id: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  enabled: boolean;
}
