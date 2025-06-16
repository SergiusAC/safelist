import { securityService } from "@/services/security-service";
import { syncService } from "@/services/sync-service";
import { dropboxService } from "@/services/sync-service/dropbox-service";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { cryptoUtils } from "@/utils/cryptoUtils";
import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DropboxTokenPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [tokenExpiresIn, setTokenExpiresIn] = useState<number>();
  const navigate = useNavigate();

  useEffect(() => {
    const _call = async () => {
      const code = query.get("code");
      if (!code || code.trim().length === 0) {
        alert("Empty code");
        return;
      }
      const result = await dropboxService.getAccessTokenFromCode(code);
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setTokenExpiresIn(result.expiresIn);
    }
    _call();
  }, []);

  const handleActivateSync = async () => {
    const masterPassword = prompt("Input master password");
    if (masterPassword === null || masterPassword.trim().length === 0) {
      alert("Master password is empty");
      return;
    }
    const keySalt = localStorageService.getSecretKeySalt();
    if (keySalt === null) {
      alert("Could not findsecret key salt in LocalStorage");
      return;
    }
    const keyDigest = localStorageService.getSecretKeyDigestBase64();
    if (keyDigest === null) {
      alert("Could not find secret key digest in LocalStorage");
      return;
    }
    try {
      const valid = await securityService.checkMasterPassword(masterPassword, keySalt, keyDigest);
      if (!valid) {
        alert("Master password is incorrect");
        return;
      }
      const key = await cryptoUtils.deriveSecretKey(masterPassword, keySalt);
      await syncService.addSyncWithDropbox(key, {
        id: nanoid(),
        accessToken: accessToken!,
        refreshToken: refreshToken!,
        accessTokenExpiresAt: getAccessTokenExpiresAt(),
        enabled: true
      });
      alert("Sync with Dropbox enabled!");
      navigate("/sync/dropbox");
    } catch (err: any) {
      alert(err.message);
    }
  }

  const getAccessTokenExpiresAt = () => {
    if (!tokenExpiresIn) {
      throw new Error("expires_in param is empty");
    }
    const nowTime = new Date().getTime();
    return nowTime + (tokenExpiresIn * 1000);
  }

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Dropbox API Token</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <div className="p-2 bg-gray-200 rounded">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Access Token</legend>
          <textarea className="input w-full h-15 text-wrap" value={accessToken || ""} />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Refresh Token</legend>
          <textarea className="input w-full h-15 text-wrap" value={refreshToken || ""} />
        </fieldset>

        <button className="btn btn-primary w-full mt-4" onClick={handleActivateSync}>Activate sync with Dropbox</button>
      </div>
    </div>
  </>
}

export default DropboxTokenPage;