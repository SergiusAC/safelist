import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { syncService } from "@/services/sync-service";
import type { YandexDiskSyncSettingsType } from "@/services/sync-service/types";
import { yandexDiskService } from "@/services/sync-service/yandex-disk-service";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const YandexSyncPage = () => {
  const navigate = useNavigate();
  const secretKey = useSelector(getSecretKey);
  const [yandexSettings, setYandexSettings] = useState<YandexDiskSyncSettingsType>();
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  const handleClickBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const _do = async () => {
      const settings = await syncService.getSyncSettings(secretKey);
      if (settings?.yandexDisk) {
        setYandexSettings(settings.yandexDisk);
        setSyncEnabled(true);
      }
    }
    _do();
  }, [])

  const handleDelete = async () => {
    if (yandexSettings !== undefined) {
      await syncService.deleteSyncWithYandexDisk(secretKey);
      alert("Sync with Yandex Disk disabled");
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
        <a className="btn btn-ghost text-xl">Sync with Yandex Disk</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <div><b>Sync status</b>: {syncEnabled ? "sync is active" : "sync is disabled"}</div>
      <div className="flex">
        <div className="flex-1 px-1">
          <form method="dialog">
            <button className="btn mt-5 w-full" onClick={handleClickBack}>Close</button>
          </form>
        </div>
        <div className="flex-1 px-1">
          <a 
            className="btn btn-primary mt-5 w-full" 
            href={syncEnabled ? undefined : yandexDiskService.getOAuthTokenUrl()} 
            target="_blank">
              Enable
          </a>
        </div>
      </div>
      <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete}>Disable</button>
    </div>
  </>
}

export default YandexSyncPage;