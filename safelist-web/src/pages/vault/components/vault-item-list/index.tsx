import LeftArrowIcon from "@/icons/LeftArrowIcon"
import type { VaultFolderT, VaultNoteT } from "@/services/vault-service/types";
import { stringUtils } from "@/utils/stringUtils";
import type React from "react";
import { useNavigate } from "react-router-dom";
import VaultItem from "../vault-item";

interface Props {
  folders: VaultFolderT[];
  notes: VaultNoteT[];
  currentFolder?: VaultFolderT;
}

const VaultItemList: React.FC<Props> = ({ folders, notes, currentFolder }) => {
  const navigate = useNavigate();

  const handleFolderBack = () => {
    if (currentFolder !== undefined) {
      if (currentFolder.parentFolderId === undefined) {
        navigate("/vault");
      } else {
        navigate("/vault/folder/" + currentFolder.parentFolderId);
      }
    }
  }

  const renderBackButton = () => {
    if (stringUtils.isNotBlank(currentFolder?.id)) {
      return <>
        <li>
          <button className="btn btn-circle btn-ghost w-full justify-start" onClick={handleFolderBack}>
            <LeftArrowIcon />
          </button>
        </li>
      </>
    }
    return <></>
  }

  const renderList = () => {
    if (folders.length === 0 && notes.length === 0) {
      return <div className="mt-2 mb-2 text-center text-md">No data</div>
    }
    const items = [...folders, ...notes];
      return items.map(item => <VaultItem key={item.id} item={item} />);
  }

  return <>
    <ul className="menu menu-md bg-base-200 rounded-box w-full">
      {renderBackButton()}
      {renderList()}
    </ul>
  </>
}

export default VaultItemList;