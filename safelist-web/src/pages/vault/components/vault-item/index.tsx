import EditIcon from "@/icons/EditIcon";
import FileIcon from "@/icons/FileIcon";
import FolderIcon from "@/icons/FolderIcon";
import type { VaultFolderT, VaultNoteT } from "@/services/vault-service/types"
import type React from "react";
import { Link } from "react-router-dom";

interface Props {
  item: VaultFolderT | VaultNoteT;
}

const VaultItem: React.FC<Props> = ({ item }) => {

  const renderItem = () => {
    if (item.type === "folder") {
      return <>
        <Link to={"/vault/folder/" + item.id} className="btn btn-circle btn-ghost w-full justify-between">
          <div className="flex items-center"><FolderIcon /> <span className="ml-2">{item.name}</span></div>
          <Link to={"/vault/edit-folder/" + item.id}>
            <EditIcon />
          </Link>
        </Link>
      </>
    } else if (item.type === "note") {
      return <>
        <Link to={"/vault/edit-note/" + item.id} className="btn btn-circle btn-ghost w-full justify-start">
          <FileIcon /> {item.name}
        </Link>
      </>
    } else {
      return <div>Unknown item type</div>
    }
  }

  return <>
    <li>
      {renderItem()}
    </li>
  </>
}

export default VaultItem;