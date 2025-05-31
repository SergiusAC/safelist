import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { SecurityService } from "@/services/security-service";
import { vaultService } from "@/services/vault-service";
import { dexieService } from "@/storage/indexed-db/dexieService";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { deriveSecretKey } from "@/utils/cryptoUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExportPage = () => {
  const navigate = useNavigate(); 

  const [exportMode, setExportMode] = useState<string>("encrypted");

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const masterPassword = prompt("Input master password");
    if (!masterPassword) {
      alert("Confirm master password");
      return;
    }
    const salt = await localStorageService.getSecretKeySalt();
    if (!salt) {
      alert("Salt is empty");
      return;
    }
    const secretKeyDigest = await localStorageService.getSecretKeyDigestBase64();
    if (!secretKeyDigest) {
      alert("Secret key digest is empty");
      return;
    }
    const passwordValid = await SecurityService.checkMasterPassword(masterPassword, salt, secretKeyDigest);
    if (!passwordValid) {
      alert("Incorrect master password");
      return;
    }
    if (exportMode === "encrypted") {
      const saltBase64 = await localStorageService.getSecretKeySaltBase64();
      const notes = await dexieService.getNotesEntity();
      const folders = await dexieService.getFoldersEntity();
      _download(
        "vault-" + new Date().getTime() + ".json", 
        notes, 
        folders, 
        saltBase64!, 
        secretKeyDigest
      );
    } else if (exportMode === "decrypted") {
      const secretKey = await deriveSecretKey(masterPassword, salt);
      const notes = await vaultService.getAllNotes(secretKey);
      const folders = await vaultService.getAllFolders(secretKey);
      const saltBase64 = await localStorageService.getSecretKeySaltBase64();
      _download(
        "vault-decrypted-" + new Date().getTime() + ".json", 
        notes, 
        folders, 
        saltBase64!, 
        secretKeyDigest
      );
    }
  }

  const _download = (filename: string, notes: any, folders: any, salt: string, secretKeyDigest: string) => {
    const exportObject = {
      "mode": exportMode,
      "notes": notes,
      "folders": folders,
      "salt": salt,
      "secretKeyDigest": secretKeyDigest
    }
    const exportObjectJson = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([exportObjectJson], {type: 'text/plain'});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;        
    document.body.appendChild(elem);
    elem.click();        
    document.body.removeChild(elem);
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
        <a className="btn btn-ghost text-xl">Export Vault</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="ml-4 mr-4">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Export mode</legend>
          <select value={exportMode} onChange={e => setExportMode(e.target.value)} className="select w-full">
            <option value="encrypted">Encrypted</option>
            <option value="decrypted">Decrypted</option>
          </select>
        </fieldset>
        <div className="flex">
          <div className="flex-1 px-1">
            <form method="dialog">
              <button className="btn btn-soft mt-5 w-full" onClick={handleClickBack}>Close</button>
            </form>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-soft btn-primary mt-5 w-full" type="submit">Export</button>
          </div>
        </div>
      </form>
    </div>
  </>
};

export default ExportPage;