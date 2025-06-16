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

## Cloud drives

- Uploads an encrypted `.json` file to Dropbox and/or Yandex Disk.
- Requires OAuth authentication for each cloud drive.
