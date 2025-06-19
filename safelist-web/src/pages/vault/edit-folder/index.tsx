import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { vaultService } from "@/services/vault-service";
import type { VaultFolderT } from "@/services/vault-service/types";
import { getSecretKey, triggerUpdate } from "@/store/slices/vaultSlice";
import { stringUtils } from "@/utils/stringUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditFolderPage = () => {
  const { folderId } = useParams<{folderId: string}>();
  const secretKey = useSelector(getSecretKey);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentFolder, setCurrentFolder] = useState<VaultFolderT>();
  const [name, setName] = useState<string>("");

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  useEffect(() => {
    const _sync = async() => {
      if (stringUtils.isBlank(folderId)) {
        return;
      }
      const folder = await vaultService.getFolderById(secretKey, folderId!)
      if (folder === undefined) {
        return;
      }
      setCurrentFolder(folder);
      setName(folder.name);
    };
    _sync();
  }, [folderId]);

  const handleClickBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (currentFolder !== undefined) {
      const nowDate = new Date();
      await vaultService.putFolder(secretKey, {
        id: currentFolder.id,
        name: name,
        createdAt: currentFolder.createdAt,
        updatedAt: nowDate,
        parentFolderId: currentFolder.parentFolderId,
        type: "folder",
      });
      dispatch(triggerUpdate());
    }
    navigate(-1);
  };

  const handleDelete = async () => {
    if (stringUtils.isBlank(folderId)) {
      return;
    }
    const answer = confirm("Do you want to delete the folder \"" + name + "\"");
    if (answer === true) {
      await vaultService.deleteFolder(secretKey, folderId);
      dispatch(triggerUpdate());
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

        <div className="flex">
          <div className="flex-1 px-1">
            <button className="btn mt-5 w-full" type="button" onClick={handleClickBack}>Close</button>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Update</button>
          </div>
        </div>
        <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete} type="button">Delete</button>
      </form>
    </div>
  </>
};

export default EditFolderPage;