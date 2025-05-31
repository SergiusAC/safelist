import { deriveSecretKey, digestAsBase64, exportKey } from "@/utils/cryptoUtils";

export class SecurityService {

  static async checkMasterPassword(masterPassword: string, salt: ArrayBuffer, actualSecretKeyDigest: string): Promise<boolean> {
    if (!masterPassword) {
      throw new Error("Master password not provided")
    }
    if (!salt) {
      throw new Error("Salt not provided")
    }
    if (!actualSecretKeyDigest) {
      throw new Error("SecretKeyDigest not provided")
    }
    const secretKey = await deriveSecretKey(masterPassword, salt);
    const secretKeyExported = await exportKey(secretKey);
    const providedSecretKeyDigest = await digestAsBase64(secretKeyExported);
    return actualSecretKeyDigest === providedSecretKeyDigest;
  }

}