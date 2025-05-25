export interface VaultType {
  notes: VaultNoteType[]; 
}

export interface VaultNoteType {
  id: string;
  name: string;
  content: string;
}
