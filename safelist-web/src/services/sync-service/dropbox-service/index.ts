import { Dropbox, DropboxAuth, DropboxResponse } from "dropbox";
import type { DropboxSyncSettingsType } from "../types";

interface AccessTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const CLIENT_ID = import.meta.env.VITE_DROPBOX_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DROPBOX_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_DROPBOX_REDIRECT_URI;

export const dropboxService = {

  async checkAndRefreshAccessToken(settings: DropboxSyncSettingsType): Promise<DropboxAuth> {
    const dbxAuth = new DropboxAuth({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      accessToken: settings.accessToken,
      refreshToken: settings.refreshToken,
      accessTokenExpiresAt: new Date(settings.accessTokenExpiresAt), 
    });
    await dbxAuth.checkAndRefreshAccessToken();
    return dbxAuth;
  },

  async getAuthenticationUrl(): Promise<string> {
    const dbxAuth = new DropboxAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })
    const result = await dbxAuth.getAuthenticationUrl(
      REDIRECT_URI, undefined, "code", "offline"
    );
    return result.toString();
  },

  async getAccessTokenFromCode(code: string): Promise<AccessTokenResponse> {
    const dbxAuth = new DropboxAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET })
    const response: DropboxResponse<any> = await dbxAuth.getAccessTokenFromCode(
      REDIRECT_URI, code
    );
    if (response.status !== 200) {
      throw new Error("Unable to retrieve access token from Dropbox");
    }
    return {
      accessToken: response.result.access_token,
      refreshToken: response.result.refresh_token,
      expiresIn: response.result.expires_in
    }
  },

  async revokeTokens(accessToken: string, refreshToken: string) {
    const dbxAuth = new Dropbox({ accessToken: accessToken, refreshToken: refreshToken });
    await dbxAuth.authTokenRevoke();
  },

  async uploadFile(accessToken: string, path: string, content: string) {
    const dbx = new Dropbox({accessToken: accessToken});
    await dbx.filesUpload({
      path: path, 
      contents: content,
      mode: {".tag": "overwrite"},
    });
  },

};