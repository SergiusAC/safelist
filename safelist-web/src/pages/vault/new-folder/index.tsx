import { useNavigate, useSearchParams } from "react-router-dom";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { vaultService } from "@/services/vault-service";
import { nanoid } from "@reduxjs/toolkit";

const NewFolderPage = () => {
  const [searchParams] = useSearchParams();

  const secretKey = useSelector(getSecretKey);
  const navigate = useNavigate();

  const [_, setAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [passwordRequired, setPasswordRequired] = useState<string>("no");

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAdding(true);
    if (secretKey !== null) {
      const nowDate = new Date();
      const folderId = searchParams.get("folderId");
      await vaultService.putFolder(secretKey, {
        id: nanoid(),
        name: name,
        passwordRequired: passwordRequired == "yes",
        createdAt: nowDate,
        updatedAt: nowDate,
        parentFolderId: folderId !== null ? folderId : undefined,
        type: "folder",
      });
    }
    navigate(-1);
    setAdding(false);
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

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Password required</legend>
          <select value={passwordRequired} onChange={e => setPasswordRequired(e.target.value)} className="select w-full">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </fieldset>

        <div className="flex">
          <div className="flex-1 px-1">
            <form method="dialog">
              <button className="btn btn-soft mt-5 w-full" onClick={handleClickBack}>Close</button>
            </form>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-soft btn-primary mt-5 w-full" type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>
  </>
}

export default NewFolderPage;