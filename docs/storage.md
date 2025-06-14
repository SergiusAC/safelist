# Storage

## IndexedDB

- IndexedDB is used to persist:
  - Encrypted notes
  - Encrypted folders
- IndexedDB was choosen because it supports large datasets

## LocalStorage

- Stores:
  - Master key digest
  - Master key salt
  - Application settings

## Yandex Disk Sync

- Uploads an encrypted `.json` file to Yandex Disk.
- Requires OAuth authentication.
