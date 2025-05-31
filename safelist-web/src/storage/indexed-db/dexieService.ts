import { dexieDB } from "./dexieDB";
import type { SimpleSecureEntity } from "./types";

export const dexieService = {

  async getNotesEntity(): Promise<SimpleSecureEntity | undefined> {
    return await dexieDB.notes.get("notes"); 
  },

  async putNotesEntity(entity: SimpleSecureEntity): Promise<string> {
    return await dexieDB.notes.put(entity);
  },

  async getFoldersEntity(): Promise<SimpleSecureEntity | undefined> {
    return await dexieDB.folders.get("folders"); 
  },

  async putFoldersEntity(entity: SimpleSecureEntity): Promise<string> {
    return await dexieDB.folders.put(entity);
  },

}