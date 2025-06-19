import { useSelector } from "react-redux";
import { getSecretKey, getUpdateTrigger } from "@/store/slices/vaultSlice";
import PlusIcon from "@/icons/PlusIcon";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FileIcon from "@/icons/FileIcon";
import FolderIcon from "@/icons/FolderIcon";
import { vaultService } from "@/services/vault-service";
import type { VaultFolderT, VaultNoteT } from "@/services/vault-service/types";
import EditIcon from "@/icons/EditIcon";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import ThreeDotsIcon from "@/icons/ThreeDotsIcon";
import { stringUtils } from "@/utils/stringUtils";

const VaultPage = () => {
  const { folderId } = useParams<{folderId: string}>();
  const navigate = useNavigate();
  const vaultUpdateTrigger = useSelector(getUpdateTrigger);
  const secretKey = useSelector(getSecretKey);
  const [notes, setNotes] = useState<VaultNoteT[]>([]);
  const [folders, setFolders] = useState<VaultFolderT[]>([]);
  const [currentPath, setCurrentPath] = useState<VaultFolderT[]>([]);
  const [currentFolder, setCurrentFolder] = useState<VaultFolderT>();

  if (!secretKey) {
    return <Navigate to={"/auth/local-login"} />
  }

  const handleFolderBack = () => {
    if (currentFolder !== undefined) {
      if (currentFolder.parentFolderId === undefined) {
        navigate("/vault");
      } else {
        navigate("/vault/folder/" + currentFolder.parentFolderId);
      }
    }
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

  const renderBreadcrumbs = () => {
    if (currentPath.length === 0) {
      return <></>;
    }
    const parts = currentPath.map(pathItem => <>
      <li><Link to={"/vault/folder/" + pathItem.id}>{pathItem.name}</Link></li>
    </>);
    return <>
      <div className="m-2 breadcrumbs text-sm">
        <ul>
          {parts}
        </ul>
      </div>
    </>
  }

  const renderVault = () => {
    if (folders.length > 0 || notes.length > 0) {
      const items = [...folders, ...notes];
      return items.map((item: VaultNoteT | VaultFolderT) => <>
        <li>
          {item.type === "folder" && <>
            <Link to={"/vault/folder/" + item.id} className="btn btn-circle btn-ghost w-full justify-between">
              <div className="flex items-center"><FolderIcon /> <span className="ml-2">{item.name}</span></div>
              <Link to={"/vault/edit-folder/" + item.id}>
                <EditIcon />
              </Link>
            </Link>
          </>}
          {item.type === "note" && <>
            <Link to={"/vault/edit-note/" + item.id} className="btn btn-circle btn-ghost w-full justify-start">
              <FileIcon /> {item.name}
            </Link>
          </>}
        </li>
      </>);
    }
    return <div className="mt-2 mb-2 text-center text-md">No data</div>
  }

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
      {renderBreadcrumbs()}
      <ul className="menu menu-md bg-base-200 rounded-box w-full">
        {folderId !== undefined && <>
          <li>
            <button className="btn btn-circle btn-ghost w-full justify-start" onClick={handleFolderBack}>
              <LeftArrowIcon />
            </button>
          </li>
        </>}
        {renderVault()}
      </ul>
    </div>
  </>
};

export default VaultPage;