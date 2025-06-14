import LeftArrowIcon from "@/icons/LeftArrowIcon";
import { securityService } from "@/services/security-service";
import { localStorageService } from "@/storage/local-storage/localStorageService";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

interface ComponentProps {
  onSuccess: () => any;
}

const ConfirmPasswordComponent: React.FC<ComponentProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [masterPassword, setMasterPassword] = useState<string>();

  const handleClickBack = () => {
    navigate(-1);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (masterPassword === undefined || masterPassword.trim().length === 0) {
      alert("Master password is empty");
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
    const passwordValid = await securityService.checkMasterPassword(masterPassword, salt, secretKeyDigest);
    if (!passwordValid) {
      alert("Incorrect master password");
      return;
    }
    onSuccess();
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
        <a className="btn btn-ghost text-xl">Confirm master password</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="mx-4">
      <div className="text-md italic mb-2">The note requires master password confirmation</div>
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
          <div className="flex-1">
            <button className="btn btn-primary mt-5 w-full" type="submit">Confirm</button>
          </div>
        </div>
      </form>
    </div>
  </>
}

export default ConfirmPasswordComponent;