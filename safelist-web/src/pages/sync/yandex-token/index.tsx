import { securityService } from "@/services/security-service";
import { syncService } from "@/services/sync-service";
import { yandexDiskService, type YandexOAuthTokenResponse } from "@/services/sync-service/yandex-disk-service";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { cryptoUtils } from "@/utils/cryptoUtils";
import { stringUtils } from "@/utils/stringUtils";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ActivateSyncParams {
  accessToken: string;
  expiresAt: number;
  keySalt: ArrayBuffer;
  keyDigest: string;
}

const _getTokenExpiresAt = (expiresIn: number) => {
  const nowDate = new Date();
  return nowDate.getTime() + (expiresIn * 1000);
}

const _getValidatedParamsForSyncActivation = (oauthResponse: YandexOAuthTokenResponse): ActivateSyncParams | null => {
  const keySalt = localStorageService.getSecretKeySalt();
  if (keySalt === null) {
    alert("Could not findsecret key salt in LocalStorage");
    return null;
  }
  const keyDigest = localStorageService.getSecretKeyDigestBase64();
  if (keyDigest === null) {
    alert("Could not find secret key digest in LocalStorage");
    return null;
  }
  return {
    accessToken: oauthResponse.accessToken,
    expiresAt: _getTokenExpiresAt(oauthResponse.expiresIn),
    keySalt: keySalt,
    keyDigest: keyDigest
  }
}

const YandexTokenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const oauthResponse = yandexDiskService.parseOAuthTokenResponseUrl(location);
  const [password, setPassword] = useState<string>();

  const handleActivateSync = async () => {
    if (stringUtils.isBlank(password)) {
      alert("Master password is empty");
      return;
    }
    const params = _getValidatedParamsForSyncActivation(oauthResponse);
    if (params === null) {
      return;
    }
    try {
      const valid = await securityService.checkMasterPassword(password!.trim(), params.keySalt, params.keyDigest);
      if (!valid) {
        alert("Master password is incorrect");
        return;
      }
      const key = await cryptoUtils.deriveSecretKey(password!.trim(), params.keySalt);
      await syncService.putSyncWithYandexDisk(key, {
        id: nanoid(),
        token: params.accessToken,
        expiresAt: params.expiresAt,
        enabled: true
      });
      alert("Sync with Yandex Disk enabled");
      navigate("/sync/yandex-disk");
    } catch (err: any) {
      alert(err.message);
    }
  }

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Yandex API Token</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <div className="p-2 bg-gray-200 rounded">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Token</legend>
          <textarea className="input w-full h-15 text-wrap" value={oauthResponse.accessToken} disabled />
        </fieldset>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Master password</legend>
          <input 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input w-full" 
            placeholder="Input your master password"
            type="password"
            required
          />
        </fieldset>
        <button className="btn btn-primary mt-4 w-full" onClick={handleActivateSync}>Activate sync with Yandex Disk</button>
      </div>
    </div>
  </>
}

export default YandexTokenPage;