import { useNavigate, useSearchParams } from "react-router-dom";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getSecretKey, triggerUpdate } from "@/store/slices/vaultSlice";
import { nanoid } from "@reduxjs/toolkit";
import { vaultService } from "@/services/vault-service";

const NewNotePage = () => {
  const [searchParams] = useSearchParams();

  const secretKey = useSelector(getSecretKey);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [_, setAdding] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAdding(true);
    try {
      if (secretKey !== null) {
        const nowDate = new Date();
        const folderId = searchParams.get("folderId");
        await vaultService.putNote(secretKey, {
          id: nanoid(),
          name: name,
          content: content,
          passwordRequired: false,
          createdAt: nowDate,
          updatedAt: nowDate,
          folderId: folderId !== null ? folderId : undefined,
          type: "note",
        });
        dispatch(triggerUpdate());
      }
      navigate(-1);
    } catch (err) {
      console.error("failed to create a note", err);
    }
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
        <a className="btn btn-ghost text-xl">New Note</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="ml-4 mr-4">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Name</legend>
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
          <legend className="fieldset-legend text-sm">Content</legend>
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            className="textarea textarea-bordered h-48 w-full"
            placeholder="Input content...">
          </textarea>
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

export default NewNotePage;