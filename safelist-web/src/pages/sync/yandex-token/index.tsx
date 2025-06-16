import { securityService } from "@/services/security-service";
import { syncService } from "@/services/sync-service";
import { yandexDiskService, type YandexOAuthTokenResponse } from "@/services/sync-service/yandex-disk-service";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { cryptoUtils } from "@/utils/cryptoUtils";
import { nanoid } from "@reduxjs/toolkit";
import { useLocation, useNavigate } from "react-router-dom";

interface ActivateSyncParams {
  accessToken: string;
  expiresAt: number;
  masterPassword: string;
  keySalt: ArrayBuffer;
  keyDigest: string;
}

const _getTokenExpiresAt = (expiresIn: number) => {
  const nowDate = new Date();
  return nowDate.getTime() + (expiresIn * 1000);
}

const _getValidatedParamsForSyncActivation = (oauthResponse: YandexOAuthTokenResponse): ActivateSyncParams | null => {
  const masterPassword = prompt("Input master password");
  if (masterPassword === null || masterPassword.trim().length === 0) {
    alert("Master password is empty");
    return null;
  }
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
    masterPassword: masterPassword,
    keySalt: keySalt,
    keyDigest: keyDigest
  }
}

const YandexTokenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const oauthResponse = yandexDiskService.parseOAuthTokenResponseUrl(location);

  const handleActivateSync = async () => {
    const params = _getValidatedParamsForSyncActivation(oauthResponse);
    if (params === null) {
      return;
    }
    try {
      const valid = await securityService.checkMasterPassword(params.masterPassword, params.keySalt, params.keyDigest);
      if (!valid) {
        alert("Master password is incorrect");
        return;
      }
      const key = await cryptoUtils.deriveSecretKey(params.masterPassword, params.keySalt);
      await syncService.addSyncWithYandexDisk(key, {
        id: nanoid(),
        token: params.accessToken,
        expiresAt: params.expiresAt,
        enabled: true
      });
      alert("Sync with Yandex Disk enabled!");
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
          <textarea className="input w-full h-15 text-wrap" value={oauthResponse.accessToken} />
          <button className="btn btn-primary mt-2" onClick={handleActivateSync}>Activate</button>
        </fieldset>
      </div>
    </div>
  </>
}

export default YandexTokenPage;