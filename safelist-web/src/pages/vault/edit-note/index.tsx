import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import LeftArrowIcon from "../../../icons/LeftArrowIcon";
import { getSecretKey, getUpdateTrigger, triggerUpdate } from "../../../store/slices/vaultSlice";
import { vaultService } from "@/services/vault-service";
import type { VaultNoteT } from "@/services/vault-service/types";
import ConfirmPasswordComponent from "../components/confirm-password";
import { stringUtils } from "@/utils/stringUtils";

const EditNotePage = () => {
  const vaultUpdates = useSelector(getUpdateTrigger);
  const secretKey = useSelector(getSecretKey);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { noteId } = useParams<{noteId: string}>();

  const [currentNote, setCurrentNote] = useState<VaultNoteT>();
  const [name, setName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [passwordRequired, setPasswordRequired] = useState<string>("no");
  const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false);

  if (!secretKey) {
    return <Navigate to="/auth/local-login" />
  }

  useEffect(() => {
    const _sync = async () => {
      if (noteId) {
        const foundNote = await vaultService.getNoteById(secretKey, noteId);
        if (foundNote) {
          setCurrentNote(foundNote);
          setName(foundNote.name);
          setContent(foundNote.content ?? "");
          setPasswordRequired(foundNote.passwordRequired === true ? "yes" : "no");
        }
      }
    }
    _sync();
  }, [noteId, vaultUpdates])

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (stringUtils.isBlank(noteId) || currentNote === undefined) {
      return;
    }
    await vaultService.putNote(secretKey, {
      id: currentNote.id,
      name: name,
      content: content,
      passwordRequired: passwordRequired === "yes",
      folderId: currentNote.folderId,
      createdAt: currentNote.createdAt,
      updatedAt: new Date(),
      type: "note",
    })
    dispatch(triggerUpdate());
    navigate(-1);
  }

  const handleDelete = async () => {
    if (stringUtils.isBlank(noteId)) {
      return;
    }
    const answer = confirm("Do you want to delete the note \"" + name + "\"");
    if (answer === true) {
      await vaultService.deleteNoteById(secretKey, noteId!);
      dispatch(triggerUpdate());
      navigate(-1);
    }
  }

  if (currentNote?.passwordRequired && !passwordConfirmed) {
    return <ConfirmPasswordComponent onSuccess={() => setPasswordConfirmed(true)} />
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
        <a className="btn btn-ghost text-xl">Edit Note</a>
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

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Password required</legend>
          <select value={passwordRequired} onChange={e => setPasswordRequired(e.target.value)} className="select w-full">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </fieldset>

        <div className="flex">
          <div className="flex-1 px-1">
            <button className="btn mt-5 w-full" onClick={handleClickBack} type="button">Close</button>
          </div>
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Update</button>
          </div>
        </div>
        <button className="btn btn-outline btn-error mt-4 w-full" onClick={handleDelete} type="button">Delete</button>
      </form>
    </div>
  </>
}

export default EditNotePage;