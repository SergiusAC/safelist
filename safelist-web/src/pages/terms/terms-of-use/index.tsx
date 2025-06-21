import LeftArrowIcon from "@/icons/LeftArrowIcon"
import { useNavigate } from "react-router-dom"

const TermOfUsePage = () => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate("/auth/local-login");
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
        <a className="btn btn-ghost text-xl">Terms of Use</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="flex justify-center">
      <div className="my-2 mx-4 prose">
        <p><strong>Last updated:</strong> 20 June 2025</p>

        <p>
          By using this application ("Safelist"), you agree to the following terms and conditions:
        </p>

        <ol>
          <li>
            <strong>Use of the Application</strong><br/>
            You are responsible for your use of the application and for any data you choose to create, encrypt, or synchronize using this software.
            This application is provided for <strong>personal use only</strong> and does not include any warranty or support.
          </li>

          <li>
            <strong>No Account or Server Storage</strong><br/>
            This application does not require registration or user accounts. All data is stored <strong>locally in your browser</strong> via IndexedDB
            and LocalStorage unless you explicitly export and upload it to a cloud service (e.g., Dropbox, Yandex Disk).
          </li>

          <li>
            <strong>Master Password Responsibility</strong><br/>
            You are solely responsible for remembering and securely managing your Master Password.
            There is <strong>no password recovery mechanism</strong>. If you forget your Master Password, all stored data is permanently inaccessible.
          </li>

          <li>
            <strong>Encrypted Backups to Cloud Services</strong><br/>
            If you choose to export encrypted data to Dropbox and/or Yandex Disk or another cloud provider:
            <ul>
              <li>You acknowledge that only <strong>encrypted data</strong> is uploaded.</li>
              <li>You are responsible for the security of your cloud account.</li>
              <li>The application does not store your cloud credentials or access your data outside of your explicit actions.</li>
            </ul>
          </li>

          <li>
            <strong>No Warranty</strong><br/>
            This application is provided <em>“as is”</em> without any warranties of any kind.
            The developer disclaims all liability for loss of data, breaches, or misuse of the application.
          </li>

          <li>
            <strong>Open Source License</strong><br/>
            The source code is released under the <strong>MIT License</strong>. By using this application, you agree to the terms of the
            open-source license under which it is distributed.
          </li>
        </ol>
      </div>
    </div>
  </>
}

export default TermOfUsePage;