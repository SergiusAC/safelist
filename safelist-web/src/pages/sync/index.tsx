import EditIcon from "@/icons/EditIcon";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { syncService } from "@/services/sync-service";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SyncStatusComponent from "./components/sync-status";
import type { SyncSettingsType } from "@/services/sync-service/types";

const SyncPage = () => {
  const navigate = useNavigate();
  const secretKey = useSelector(getSecretKey);
  const [syncSettings, setSyncSettings] = useState<SyncSettingsType>();

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  const handleClickBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const _call = async () => {
      const settings = await syncService.getSyncSettings(secretKey);
      if (settings !== null) {
        setSyncSettings(settings);
      }
    }
    _call();
  }, []);

  const isDropboxSyncEnabled = () => {
    return syncSettings?.dropbox !== undefined && syncSettings.dropbox !== null;
  }
  
  const isDropboxSyncExpired = () => {
    if (!syncSettings?.dropbox?.accessTokenExpiresAt) {
      return false;
    }
    return (new Date().getTime()) >= syncSettings.dropbox.accessTokenExpiresAt;
  }

  const isYandexSyncEnabled = () => {
    return syncSettings?.yandexDisk !== undefined && syncSettings.yandexDisk !== null;
  }
  
  const isYandexSyncExpired = () => {
    if (!syncSettings?.yandexDisk?.expiresAt) {
      return false;
    }
    return (new Date().getTime()) >= syncSettings.yandexDisk.expiresAt;
  }

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={handleClickBack}>
          <div className="indicator">
            <LeftArrowIcon />
          </div>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Sync Settings</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="list-row">
          <div className="list-col-grow flex items-center">
            <div>
              <SyncStatusComponent syncEnabled={isDropboxSyncEnabled()} syncExpired={isDropboxSyncExpired()} /> Dropbox
            </div>
          </div>
          <Link className="btn btn-square btn-ghost" to="/sync/dropbox">
            <EditIcon />
          </Link>
        </li>
        <li className="list-row">
          <div className="list-col-grow flex items-center">
            <div>
              <SyncStatusComponent syncEnabled={isYandexSyncEnabled()} syncExpired={isYandexSyncExpired()} /> Yandex Disk
            </div>
          </div>
          <Link className="btn btn-square btn-ghost" to="/sync/yandex-disk">
            <EditIcon />
          </Link>
        </li>
      </ul>
    </div>
  </>
}

export default SyncPage;