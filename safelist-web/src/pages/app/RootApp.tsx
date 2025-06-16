import { syncService } from "@/services/sync-service";
import { getSecretKey, getUpdateTrigger } from "@/store/slices/vaultSlice";
import type React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const RootApp: React.FC = () => {
  const secretKey = useSelector(getSecretKey);
  const vaultUpdateTrigger = useSelector(getUpdateTrigger);

  useEffect(() => {
    const _startSync = async () => {
      if (secretKey !== null && secretKey !== undefined) {
        console.log("start sync");
        try {
          await syncService.startSync(secretKey);
        } catch (err: any) {
          console.error(err);
          alert("Sync failed with error: " + err.message + ". Try to update the sync settings.");
        }
        console.log("end sync");
      }
    };
    _startSync();
  }, [vaultUpdateTrigger]);

  return <>
    <Outlet />
  </>;
};

export default RootApp;