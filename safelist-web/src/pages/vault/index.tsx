import { useSelector } from "react-redux";
import { getSecretKey, getUpdateTrigger } from "@/store/slices/vaultSlice";
import EditIcon from "@/icons/EditIcon";
import PlusIcon from "@/icons/PlusIcon";
import FileDownloadIcon from "@/icons/FileDownloadIcon";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { VaultType } from "@/services/vault-service/types";
import { VaultService } from "@/services/vault-service";

const VaultPage = () => {
  const vaultUpdateTrigger = useSelector(getUpdateTrigger);
  const secretKey = useSelector(getSecretKey);
  const [myVault, setVault] = useState<VaultType>();

  if (secretKey === null) {
    return <Navigate to={"/auth/local-login"} />
  }

  useEffect(() => {
    const syncVault = async () => {
      if (secretKey !== null) {
        const vault = await VaultService.loadVault(secretKey);
        if (vault) {
          setVault(vault);
        }
      }
    }
    syncVault();
  }, [vaultUpdateTrigger])

  const renderVault = () => {
    if (myVault && myVault.notes && myVault.notes.length > 0) {
      return myVault.notes.map((note: any, idx: number) => <>
        <li className="list-row">
          <div className="text-xl font-thin opacity-30 tabular-nums m-auto">{idx + 1}</div>
          <div className="mt-auto mb-auto">
            <span>{note.name}</span>
          </div>
          <Link to={"/vault/edit-note/" + note.id} className="btn btn-circle btn-ghost"><EditIcon /></Link>
        </li>
      </>);
    }
    return <div className="mt-2 mb-2 text-center text-lg">No notes</div>
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
      <ul className="menu menu-horizontal bg-base-200 rounded-box w-full mb-2">
        <li>
          <Link to="/export">
            <FileDownloadIcon /> Export
          </Link>
        </li>
        <li>
          <Link to="/vault/new-note">
            <PlusIcon /> Add
          </Link>
        </li>
      </ul>
      <ul className="list bg-base-100 rounded-box shadow-md mb-4">
        {renderVault()}
      </ul>
    </div>
  </>
};

export default VaultPage;