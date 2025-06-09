export interface SyncSettingsType {
  yandexDisk: YandexDiskSyncSettingsType | null;
}

export interface YandexDiskSyncSettingsType {
  id: string;
  token: string;
  enabled: boolean;
}