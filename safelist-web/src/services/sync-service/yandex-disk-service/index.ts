import { stringUtils } from "@/utils/stringUtils";
import type { Location } from "react-router-dom";

const CLIENT_ID = import.meta.env.VITE_YANDEX_CLIENT_ID;
const API_RESOURCES = "https://cloud-api.yandex.net/v1/disk/resources?path=app:";
const API_DOWNLOAD = "https://cloud-api.yandex.net/v1/disk/resources/download?path=app:";
const API_UPLOAD = "https://cloud-api.yandex.net/v1/disk/resources/upload?path=app:";
const BACKUPS_PATH = "/backups";

export interface YandexOAuthTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export const yandexDiskService = {

  getOAuthTokenUrl() {
    return `https://oauth.yandex.ru/authorize?response_type=token&client_id=${CLIENT_ID}`;
  },

  parseOAuthTokenResponseUrl(location: Location): YandexOAuthTokenResponse {
    const query = new URLSearchParams(location.hash.replace("#", ""));
    const accessToken = query.get("access_token");
    if (accessToken === null || accessToken.trim().length === 0) {
      throw new Error("access_token was not retrieved");
    }
    const expiresIn = query.get("expires_in");
    if (stringUtils.isBlank(expiresIn)) {
      throw new Error("expires_at parameter was not retrieved");
    }
    return {
      accessToken: accessToken,
      expiresIn: Number.parseInt(expiresIn!)
    }
  },

  async backupsExists(token: string): Promise<boolean> {
    const response = await fetch(API_RESOURCES + BACKUPS_PATH, {
      headers: {
        Accept: "application/json",
        Authorization: "OAuth " + token
      }
    });
    if (response.status === 404) {
      return false;
    }
    if (response.status === 200) {
      return true;
    }
    throw new Error("Cannot handle the response status: " + response.status);
  },

  async readBackup(token: string): Promise<string> {
    const downloadResp = await fetch(
      API_DOWNLOAD + BACKUPS_PATH + "/vault.json", 
      {
        headers: {
          Accept: "application/json",
          Authorization: "OAuth " + token
        }
      }
    );
    if (downloadResp.status !== 200) {
      throw new Error("Failed to get link for downloading backup from Yandex Disk");
    }
    const downloadRespText = await downloadResp.text();
    const downloadData = JSON.parse(downloadRespText);
    if (!("href" in downloadData)) {
      throw new Error("Incorrect response for downloading backup from Yandex Disk");
    }
    const backupResp = await fetch(downloadData.href, { method: "GET" });
    if (backupResp.status !== 200) {
      throw new Error("Failed to download backup from Yandex Disk");
    }
    return await backupResp.text();
  },

  async createBackupsFolder(token: string): Promise<void> {
    const response = await this.createFolder(token, BACKUPS_PATH);
    if (response.status !== 201 && response.status !== 409) {
      throw new Error("Failed to create folder in Yandex Disk");
    }
  },

  async createFolder(token: string, path: string): Promise<Response> {
    return await fetch(API_RESOURCES + path, {
      headers: {
        Accept: "application/json",
        Authorization: "OAuth " + token,
        "Content-Type": "application/json"
      },
      method: "PUT"
    });
  },

  async createBackup(token: string, fileContent: string) {
    const response = await fetch(
      API_UPLOAD + BACKUPS_PATH + "/vault.json&overwrite=true", 
      {
        headers: {
          Accept: "application/json",
          Authorization: "OAuth " + token
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to create backup, error response");
    }
    const uploadData = JSON.parse(await response.text());
    const uploadURL = uploadData.href;
    if (!uploadURL) {
      throw new Error("Failed to create backup, incorrect response body");
    }
    await fetch(uploadURL, {
      method: "PUT",
      body: fileContent
    });
  },
  
}