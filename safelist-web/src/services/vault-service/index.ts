import { cryptoUtils } from "@/utils/cryptoUtils";
import type { VaultFolderT, VaultNoteT } from "./types";
import { dexieService } from "@/storage/indexed-db/dexieService";

/**
 * Service to manage vault data.
 */
export const vaultService = {

  async getAllNotes(key: CryptoKey): Promise<VaultNoteT[]> {
    const notesEntity = await dexieService.getNotesEntity();
    if (!notesEntity) {
      return [];
    }
    const notesJsonString = await cryptoUtils.decryptText(key, notesEntity.ciphertext, notesEntity.iv);
    return JSON.parse(notesJsonString);
  },

  async getRootNotes(key: CryptoKey): Promise<VaultNoteT[]> {
    const allNotes = await this.getAllNotes(key);
    return allNotes.filter(iterNote => iterNote.folderId === undefined || iterNote.folderId === null);
  },

  async getNotesByFolderId(key: CryptoKey, folderId: string): Promise<VaultNoteT[]> {
    const allNotes = await this.getAllNotes(key);
    return allNotes.filter(iterNote => iterNote.folderId === folderId);
  },

  async getNoteById(key: CryptoKey, noteId: string): Promise<VaultNoteT | undefined> {
    const notes = await this.getAllNotes(key);
    if (notes.length === 0) {
      return undefined;
    }
    return notes.find(iterNote => iterNote.id === noteId);
  },

  async getAllFolders(key: CryptoKey): Promise<VaultFolderT[]> {
    const foldersEntity = await dexieService.getFoldersEntity();
    if (!foldersEntity) {
      return [];
    }
    const foldersJsonString = await cryptoUtils.decryptText(key, foldersEntity.ciphertext, foldersEntity.iv);
    return JSON.parse(foldersJsonString);
  },

  async getFolders(key: CryptoKey, parentFolderId?: string): Promise<VaultFolderT[]> {
    const foldersEntity = await dexieService.getFoldersEntity();
    if (!foldersEntity) {
      return [];
    }
    const foldersJsonString = await cryptoUtils.decryptText(key, foldersEntity.ciphertext, foldersEntity.iv);
    const folders: VaultFolderT[] = JSON.parse(foldersJsonString);
    if (parentFolderId !== undefined) {
      return folders.filter(iterFolder => iterFolder.parentFolderId === parentFolderId);
    }
    return folders.filter(iterFolder => iterFolder.parentFolderId === undefined || iterFolder.parentFolderId === null);
  },

  async getFolderById(key: CryptoKey, folderId: string): Promise<VaultFolderT | undefined> {
    const allFolders = await this.getAllFolders(key);
    return allFolders.find(iterFolder => iterFolder.id === folderId);
  },

  async pwd(key: CryptoKey, folderId?: string): Promise<VaultFolderT[]> {
    if (folderId === undefined) {
      return [];
    }
    const result = [];
    const allFolders = await this.getAllFolders(key);
    let _folderId: string | undefined = folderId;
    while (_folderId !== undefined) {
      const foundFolder = allFolders.find(iterFolder => iterFolder.id === _folderId);
      if (foundFolder !== undefined) {
        result.push(foundFolder);
      }
      _folderId = foundFolder?.parentFolderId;
    }
    return result.reverse();
  },

  async putNote(key: CryptoKey, note: VaultNoteT) {
    const notes = await this.getAllNotes(key);
    const idx = notes.findIndex(iterNote => iterNote.id === note.id);
    if (idx >= 0) {
      notes[idx] = note;
    } else {
      notes.push(note);
    }
    await this._persist(key, notes, "notes");
  },

  async deleteNoteById(key: CryptoKey, noteId: string) {
    const notes = await this.getAllNotes(key);
    if (notes.length === 0) {
      return;
    }
    const idx = notes.findIndex(iterNote => iterNote.id === noteId);
    if (idx >= 0) {
      notes.splice(idx, 1);
    }
    await this._persist(key, notes, "notes");
  },

  async putFolder(key: CryptoKey, folder: VaultFolderT) {
    const folders = await this.getAllFolders(key);
    const idx = folders.findIndex(iterFolder => iterFolder.id === folder.id);
    if (idx >= 0) {
      folders[idx] = folder;
    } else {
      folders.push(folder);
    }
    await this._persist(key, folders, "folders");
  },

  async deleteFolder(key: CryptoKey, folderId: string | undefined) {
    if (folderId === undefined) {
      return;
    }
    const folders = await this.getAllFolders(key);
    const idx = folders.findIndex(iterFolder => iterFolder.id === folderId);
    if (idx >= 0) {
      folders.splice(idx, 1);
    }
    await this._persist(key, folders, "folders");
    const notes = await this.getNotesByFolderId(key, folderId);
    if (notes.length > 0) {
      for (const note of notes) {
        await this.deleteNoteById(key, note.id);
      }
    }
    const childFolders = await this.getFolders(key, folderId);
    if (childFolders.length > 0) {
      for (const childFolder of childFolders) {
        await this.deleteFolder(key, childFolder.id);
      }
    }
  },

  async _persist(key: CryptoKey, items: VaultNoteT[] | VaultFolderT[], itemType: "notes" | "folders") {
    const itemsJson = JSON.stringify(items);
    const itemsCiphered = await cryptoUtils.encryptText(key, itemsJson);
    if (itemType === "notes") {
      await dexieService.putNotesEntity({
        id: "notes", 
        ciphertext: itemsCiphered.ciphertext, 
        iv: itemsCiphered.iv
      });
    } else if (itemType == "folders") {
      await dexieService.putFoldersEntity({
        id: "folders", 
        ciphertext: itemsCiphered.ciphertext, 
        iv: itemsCiphered.iv
      });
    }
  }

}