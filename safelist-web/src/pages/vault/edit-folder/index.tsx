import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { vaultService } from "@/services/vault-service";
import type { VaultFolderT } from "@/services/vault-service/types";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EditFolderPage = () => {
  const { folderId } = useParams<{folderId: string}>();
  const secretKey = useSelector(getSecretKey);
  const navigate = useNavigate();
  const [currentFolder, setCurrentFolder] = useState<VaultFolderT>();
  const [name, setName] = useState<string>("");
  const [passwordRequired, setPasswordRequired] = useState<string>("no");

  useEffect(() => {
    const _sync = async() => {
      if (!secretKey || !folderId) {
        return;
      }
      const folder = await vaultService.getFolderById(secretKey, folderId)
      if (folder === undefined) {
        return;
      }
      setCurrentFolder(folder);
      setName(folder.name);
      if (folder.passwordRequired === true) {
        setPasswordRequired("yes");
      } else {
        setPasswordRequired("no");
      }
    };
    _sync();
  }, [folderId]);

  const handleClickBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (secretKey !== null && currentFolder !== undefined) {
      const nowDate = new Date();
      await vaultService.putFolder(secretKey, {
        id: currentFolder.id,
        name: name,
        passwordRequired: passwordRequired == "yes",
        createdAt: currentFolder.createdAt,
        updatedAt: nowDate,
        parentFolderId: currentFolder.parentFolderId,
        type: "folder",
      });
    }
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!secretKey || !folderId) {
      return;
    }
    const answer = confirm("Do you want to delete the folder \"" + name + "\"");
    if (answer === true) {
      await vaultService.deleteFolder(secretKey, folderId);
      navigate(-1);
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
        <a className="btn btn-ghost text-xl">Edit Folder</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="ml-4 mr-4">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Folder name</legend>
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            type="text" 
            className="input w-full" 
            placeholder="Input name..." 
            required 
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Password required</legend>
          <select value={passwordRequired} onChange={e => setPasswordRequired(e.target.value)} className="select w-full">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </fieldset>

        <div className="flex">
          <div className="flex-1 px-1">
            <button className="btn btn-soft mt-5 w-full" type="button" onClick={handleClickBack}>Close</button>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-soft btn-primary mt-5 w-full" type="submit">Update</button>
          </div>
        </div>
        <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete} type="button">Delete</button>
      </form>
    </div>
  </>
};

export default EditFolderPage;