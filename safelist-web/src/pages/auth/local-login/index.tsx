import { localStorageService } from "@/storage/local-storage/localStorageService";
import { triggerUpdate, updateSecretKey } from "@/store/slices/vaultSlice";
import { arrayBufferToBase64, deriveSecretKey, digestAsBase64, exportKey, generateSalt } from "@/utils/cryptoUtils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LocalLoginPage = () => {
  const [masterPassword, setMasterPassword] = useState<string>("");
  const storedSecretKeyDigest = useSelector(() => localStorageService.getSecretKeyDigestBase64());
  const storedSalt = useSelector(() => localStorageService.getSecretKeySalt());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const salt = storedSalt !== null ? storedSalt : generateSalt();
    const secretKey = await deriveSecretKey(masterPassword, salt);
    const secretKeyExported = await exportKey(secretKey);
    const secretKeyHash = await digestAsBase64(secretKeyExported);
    if (storedSecretKeyDigest && storedSecretKeyDigest !== secretKeyHash) {
      console.log(storedSecretKeyDigest, secretKeyHash)
      alert("Incorrect master password");
      return;
    }
    localStorageService.setSecretKeySalt(arrayBufferToBase64(salt));
    localStorageService.setSecretKeyDigest(secretKeyHash)
    dispatch(updateSecretKey(secretKey));
    dispatch(triggerUpdate());
    navigate("/vault", { flushSync: true });
  }

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Local Auth</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Master Password</legend>
          <input 
            value={masterPassword}
            onChange={e => setMasterPassword(e.target.value)}
            type="password" 
            className="input w-full" 
            placeholder="Input password..." 
            required 
          />
        </fieldset>
        <div className="flex">
          <div className="flex-1 px-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  </>
};

export default LocalLoginPage;