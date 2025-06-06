import type { SimpleSecureEntity } from "@/storage/indexed-db/types";
import type { VaultFolderT, VaultNoteT } from "@/services/vault-service/types";

export interface EncryptedVaultExportType {
  mode: "encrypted",
  notes: SimpleSecureEntity,
  folders: SimpleSecureEntity,
  salt: string,
  secretKeyDigest: string
}

export interface DecryptedVaultExportType {
  mode: "decrypted",
  notes: VaultNoteT[],
  folders: VaultFolderT[],
}