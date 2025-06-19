import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getSecretKey, triggerUpdate } from "@/store/slices/vaultSlice";
import { vaultService } from "@/services/vault-service";
import { nanoid } from "@reduxjs/toolkit";

const NewFolderPage = () => {
  const [searchParams] = useSearchParams();

  const secretKey = useSelector(getSecretKey);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const nowDate = new Date();
    const folderId = searchParams.get("folderId");
    await vaultService.putFolder(secretKey, {
      id: nanoid(),
      name: name,
      createdAt: nowDate,
      updatedAt: nowDate,
      parentFolderId: folderId !== null ? folderId : undefined,
      type: "folder",
    });
    dispatch(triggerUpdate());
    navigate(-1);
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
        <a className="btn btn-ghost text-xl">New Folder</a>
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
            <form method="dialog">
              <button className="btn mt-5 w-full" onClick={handleClickBack}>Close</button>
            </form>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>
  </>
}

export default NewFolderPage;