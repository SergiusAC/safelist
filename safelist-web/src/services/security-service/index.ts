import { deriveSecretKey, digestAsBase64, exportKey } from "@/utils/cryptoUtils";

export class SecurityService {

  static async checkMasterPassword(masterPassword: string, salt: ArrayBuffer, secretKeyDigest: string): Promise<boolean> {
    if (!masterPassword) {
      throw new Error("Master password not provided")
    }
    if (!salt) {
      throw new Error("Salt not provided")
    }
    if (!secretKeyDigest) {
      throw new Error("SecretKeyDigest not provided")
    }
    const secretKey = await deriveSecretKey(masterPassword, salt);
    const secretKeyExported = await exportKey(secretKey);
    const actualSecretKeyDigest = await digestAsBase64(secretKeyExported);
    console.log(secretKeyDigest, actualSecretKeyDigest);
    return secretKeyDigest === actualSecretKeyDigest;
  }

}