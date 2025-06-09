import { dexieService } from "@/storage/indexed-db/dexieService";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { ioUtils } from "@/utils/ioUtils";
import type { DecryptedVaultExportType, EncryptedVaultExportType } from "./types";
import { vaultService } from "@/services/vault-service";
import { cryptoUtils } from "@/utils/cryptoUtils";

export const exportService = {

  async export(masterPassword: string, salt: ArrayBuffer, secretKeyDigest: string, mode: string) {
    if (mode === "encrypted") {
      const saltBase64 = await localStorageService.getSecretKeySaltBase64();
      const notes = await dexieService.getNotesEntity();
      const folders = await dexieService.getFoldersEntity();
      const downloadObj: EncryptedVaultExportType = {
        mode: "encrypted",
        notes: notes!,
        folders: folders!,
        salt: saltBase64!,
        secretKeyDigest: secretKeyDigest
      }
      ioUtils.downloadBlob(downloadObj, "vault-" + new Date().getTime() + ".json");
    } else if (mode === "decrypted") {
      const secretKey = await cryptoUtils.deriveSecretKey(masterPassword, salt);
      const notes = await vaultService.getAllNotes(secretKey);
      const folders = await vaultService.getAllFolders(secretKey);
      const downloadObj: DecryptedVaultExportType = {
        mode: "decrypted",
        notes: notes!,
        folders: folders!,
      }
      ioUtils.downloadBlob(downloadObj, "vault-decrypted-" + new Date().getTime() + ".json");
    }
  },

  async getEncryptedVault() {
    const salt = localStorageService.getSecretKeySaltBase64();
    const secretKeyDigest = localStorageService.getSecretKeyDigestBase64();
    if (salt === null || secretKeyDigest === null) {
      throw new Error("salt or secretKeyDigest are null");
    }
    const notes = await dexieService.getNotesEntity();
    const folders = await dexieService.getFoldersEntity();
    if (notes === undefined || folders === undefined) {
      throw new Error("notes or folders are undefined");
    }
    const result: EncryptedVaultExportType = {
      mode: "encrypted",
      notes: notes,
      folders: folders,
      salt: salt,
      secretKeyDigest: secretKeyDigest
    }
    return result;
  }

}