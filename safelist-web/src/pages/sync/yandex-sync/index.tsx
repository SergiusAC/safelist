import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { syncService } from "@/services/sync-service";
import { yandexDiskService } from "@/services/sync-service/yandex-disk-service";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const YandexSyncPage = () => {
  const navigate = useNavigate();
  const secretKey = useSelector(getSecretKey);
  const [yandexToken, setYandexToken] = useState("");

  const handleClickBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const _do = async () => {
      if (!secretKey) {
        navigate("/auth/local-login");
        return;
      }
      const settings = await syncService.getSyncSettings(secretKey);
      if (settings?.yandexDisk) {
        setYandexToken(settings.yandexDisk.token);
      }
    }
    _do();
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (!secretKey) {
        navigate("/auth/local-login");
        return;
      }
      const backupsExists = await yandexDiskService.backupsExists(yandexToken);
      if (!backupsExists) {
        await yandexDiskService.createBackupsFolder(yandexToken);
      }
      syncService.addSyncWithYandexDisk(secretKey, { 
        id: nanoid(), 
        token: yandexToken, 
        enabled: true 
      });
      alert("Sync with Yandex Disk added");
      navigate("/vault");
    } catch (ex) {
      console.error(ex);
      alert(ex);
    }
  }

  const handleDelete = async () => {
    if (!secretKey) {
      navigate("/auth/local-login");
      return;
    }
    await syncService.deleteSyncWithYandexDisk(secretKey);
    alert("Sync with Yandex Disk deleted");
    navigate("/vault");
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
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Yandex OAuth-token</legend>
          <input 
            value={yandexToken}
            onChange={e => setYandexToken(e.target.value)}
            type="text" 
            className="input w-full" 
            placeholder="OAuth-token" 
            required 
          />
        </fieldset>

        <div className="flex">
          <div className="flex-1 px-1">
            <form method="dialog">
              <button className="btn mt-5 w-full" onClick={handleClickBack} type="button">Close</button>
            </form>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Enable</button>
          </div>
        </div>
        <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete} type="button">Delete</button>
      </form>
    </div>
  </>
}

export default YandexSyncPage;