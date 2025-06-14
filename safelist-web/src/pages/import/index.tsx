import LeftArrowIcon from "@/icons/LeftArrowIcon";
import type { DecryptedVaultExportType, EncryptedVaultExportType } from "@/services/export-service/types";
import { securityService } from "@/services/security-service";
import { vaultService } from "@/services/vault-service";
import { dexieService } from "@/storage/indexed-db/dexieService";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import { triggerUpdate, updateSecretKey } from "@/store/slices/vaultSlice";
import { cryptoUtils } from "@/utils/cryptoUtils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ImportPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileReader = new FileReader();

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!fileReader.readyState) {
      alert("Content is not read yet");
      return;
    }
    const fileContent = fileReader.result as string;
    const parsedFile = JSON.parse(fileContent);
    if (!("mode" in parsedFile)) {
      alert("Incorrect file structure");
      return;
    }
    if (parsedFile["mode"] === "encrypted") {
      const encryptedVault = parsedFile as EncryptedVaultExportType;
      const masterPassword = prompt("Input master password of the vault");
      if (!masterPassword || masterPassword.trim().length === 0) {
        alert("Master password is required")
        return;
      }
      const salt = cryptoUtils.base64ToArrayBuffer(encryptedVault.salt);
      const valid = await securityService.checkMasterPassword(masterPassword, salt, encryptedVault.secretKeyDigest);
      if (!valid) {
        alert("Master password is incorrect")
        return;
      }
      const secretKey = await cryptoUtils.deriveSecretKey(masterPassword, salt);
      localStorageService.setSecretKeySalt(encryptedVault.salt);
      localStorageService.setSecretKeyDigest(encryptedVault.secretKeyDigest);
      await dexieService.putNotesEntity(encryptedVault.notes);
      await dexieService.putFoldersEntity(encryptedVault.folders);
      dispatch(updateSecretKey(secretKey));
      dispatch(triggerUpdate());
      navigate("/vault");
    } else if (parsedFile["mode"] === "decrypted") {
      const masterPassword = prompt("Input master password of the current vault");
      if (!masterPassword || masterPassword.trim().length === 0) {
        alert("Master password is empty");
        return;
      }
      const secretKeySalt = await localStorageService.getSecretKeySalt();
      if (!secretKeySalt) {
        navigate("/auth/local-login");
        return;
      }
      const secretKeyDigestB64 = await localStorageService.getSecretKeyDigestBase64();
      if (!secretKeyDigestB64) {
        navigate("/auth/local-login");
        return;
      }
      const valid = await securityService.checkMasterPassword(masterPassword, secretKeySalt, secretKeyDigestB64);
      if (!valid) {
        alert("Master password is incorrect");
        return;
      }
      const decryptedVault = parsedFile as DecryptedVaultExportType;
      const secretKey = await cryptoUtils.deriveSecretKey(masterPassword, secretKeySalt);
      for (const note of decryptedVault.notes) {
        await vaultService.putNote(secretKey, note);
      }
      for (const folder of decryptedVault.folders) {
        await vaultService.putFolder(secretKey, folder);
      }
      navigate("/vault");
    } else {
      alert("Unknow mode \"" + parsedFile["mode"] + "\"");
      return;
    }
  }

  const changeFile = (e: any) => {
    console.log(e.target.files);
    fileReader.readAsText(e.target.files[0]);
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
        <a className="btn btn-ghost text-xl">Import Vault</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="ml-4 mr-4">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">File</legend>
          <input onChange={changeFile} type="file" className="file-input file-input-sm w-full" />
        </fieldset>
        <div className="flex">
          <div className="flex-1 px-1">
            <form method="dialog">
              <button className="btn mt-5 w-full" onClick={handleClickBack}>Close</button>
            </form>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Import</button>
          </div>
        </div>
      </form>
    </div>
  </>
};

export default ImportPage;