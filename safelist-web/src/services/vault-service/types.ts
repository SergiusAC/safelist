export interface VaultT {
  version: string;
}

export interface VaultNoteT {
  id: string;
  name: string;
  content: string;
  passwordRequired: boolean;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
  type: "note";
}

export interface VaultFolderT {
  id: string;
  name: string;
  parentFolderId?: string;
  createdAt: Date;
  updatedAt: Date;
  type: "folder";
}