import { cryptoUtils } from "@/utils/cryptoUtils";

export const securityService = {
  
  async checkMasterPassword(masterPassword: string, salt: ArrayBuffer, actualSecretKeyDigest: string): Promise<boolean> {
    if (!masterPassword) {
      throw new Error("Master password not provided")
    }
    if (!salt) {
      throw new Error("Salt not provided")
    }
    if (!actualSecretKeyDigest) {
      throw new Error("SecretKeyDigest not provided")
    }
    const secretKey = await cryptoUtils.deriveSecretKey(masterPassword, salt);
    const secretKeyExported = await cryptoUtils.exportKey(secretKey);
    const providedSecretKeyDigest = await cryptoUtils.digestAsBase64(secretKeyExported);
    return actualSecretKeyDigest === providedSecretKeyDigest;
  },

}
