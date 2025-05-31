export interface SimpleSecureEntity {
  id: "notes" | "folders";
  ciphertext: string;
  iv: string;
}