import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { syncService } from "@/services/sync-service";
import { dropboxService } from "@/services/sync-service/dropbox-service";
import type { SyncSettingsType } from "@/services/sync-service/types";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const DropboxSyncPage = () => {
  const navigate = useNavigate();
  const secretKey = useSelector(getSecretKey);
  const [authUrl, setAuthUrl] = useState<String>();
  const [syncEnabled, setSyncEnabled] = useState<boolean>();
  const [syncSettings, setSyncSettings] = useState<SyncSettingsType>();

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  const handleClickBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const _call = async () => {
      const settings = await syncService.getSyncSettings(secretKey)
      setSyncSettings(settings || undefined);
      const _syncEnabled = settings?.dropbox !== undefined && settings?.dropbox !== null;
      setSyncEnabled(_syncEnabled);
      if (!_syncEnabled) {
        const urlResp = await dropboxService.getAuthenticationUrl();
        setAuthUrl(urlResp);
      }
    }
    _call();
  }, []);

  const handleDelete = async () => {
    if (syncSettings?.dropbox !== undefined && syncSettings?.dropbox !== null) {
      await dropboxService.revokeTokens(syncSettings.dropbox.accessToken, syncSettings.dropbox.refreshToken);
      await syncService.deleteSyncWithDropbox(secretKey);
      alert("Sync with Dropbox disabled");
      navigate("/vault");
    }
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
        <a className="btn btn-ghost text-xl">Sync with Dropbox</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <div><b>Sync status</b>: {syncEnabled ? "sync is active" : "sync is disabled"}</div>

      <div className="flex">
        <div className="flex-1 px-1">
          <button className="btn mt-5 w-full" onClick={handleClickBack}>Close</button>
        </div>
        <div className="flex-1 px-1">
          <a target="_blank" className="btn btn-primary mt-5 w-full" href={authUrl?.toString()}>Enable</a>
        </div>
      </div>
      <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete}>Disable</button>
    </div>
  </>
}

export default DropboxSyncPage;