import Dexie, { type EntityTable } from "dexie";
import type { SimpleSecureEntity } from "./types";

export const dexieDB = new Dexie("safelistDatabase") as Dexie & {
  notes: EntityTable<SimpleSecureEntity, "id">,
  folders: EntityTable<SimpleSecureEntity, "id">,
};

dexieDB.version(1).stores({
  notes: "id",
  folders: "id",
});