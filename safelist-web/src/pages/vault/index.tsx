import { useSelector } from "react-redux";
import { getSecretKey, getUpdateTrigger } from "@/store/slices/vaultSlice";
import PlusIcon from "@/icons/PlusIcon";
import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { vaultService } from "@/services/vault-service";
import type { VaultFolderT, VaultNoteT } from "@/services/vault-service/types";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import { stringUtils } from "@/utils/stringUtils";
import VaultBreadcrumbs from "./components/vault-breadcrumbs";
import VaultItemList from "./components/vault-item-list";

const VaultPage = () => {
  const { folderId } = useParams<{folderId: string}>();
  const vaultUpdateTrigger = useSelector(getUpdateTrigger);
  const secretKey = useSelector(getSecretKey);
  const [notes, setNotes] = useState<VaultNoteT[]>([]);
  const [folders, setFolders] = useState<VaultFolderT[]>([]);
  const [currentPath, setCurrentPath] = useState<VaultFolderT[]>([]);
  const [currentFolder, setCurrentFolder] = useState<VaultFolderT>();

  if (!secretKey) {
    return <Navigate to={"/auth/local-login"} />
  }

  useEffect(() => {
    const syncVault = async () => {
      if (stringUtils.isBlank(folderId)) {
        setCurrentFolder(undefined);
        const _notes = await vaultService.getRootNotes(secretKey);
        setNotes(_notes);
        const _folders = await vaultService.getFolders(secretKey);
        setFolders(_folders);
        setCurrentPath([]);
        return;
      }
      if (stringUtils.isNotBlank(folderId)) {
        const _currentFolder = await vaultService.getFolderById(secretKey, folderId!);
        setCurrentFolder(_currentFolder);
        const _folders = await vaultService.getFolders(secretKey, folderId);
        setFolders(_folders);
        const _notes = await vaultService.getNotesByFolderId(secretKey, folderId!);
        setNotes(_notes);
        const pwdRes = await vaultService.pwd(secretKey, folderId);
        setCurrentPath(pwdRes);
        return;
      }
    }
    syncVault();
  }, [vaultUpdateTrigger, folderId])

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-2xl">Safelist</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="ml-2 mr-2">
      <ul className="flex bg-base-200 rounded-box w-full justify-between mb-2">
        <div className="flex">
          <ul className="menu menu-horizontal">
            <li>
              <Link to={"/vault/new-note" + (folderId !== undefined ? "?folderId=" + folderId : "")}>
                <PlusIcon /> Note
              </Link>
            </li>
            <li>
              <Link to={"/vault/new-folder" + (folderId !== undefined ? "?folderId=" + folderId : "")}>
                <PlusIcon /> Folder
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex">
          <ul className="menu menu-horizontal">
            <li>
              <details open={false}>
                <summary><ThreeDotsIcon /></summary>
                <ul className="right-2 z-1 w-40">
                  <li><Link to="/export">Export</Link></li>
                  <li><Link to="/import">Import</Link></li>
                  <li><Link to="/sync">Sync</Link></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </ul>
      <VaultBreadcrumbs foldersPath={currentPath} />
      <VaultItemList currentFolder={currentFolder} folders={folders} notes={notes} />
    </div>
  </>
};

export default VaultPage;