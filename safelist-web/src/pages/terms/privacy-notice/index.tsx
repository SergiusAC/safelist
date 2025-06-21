import LeftArrowIcon from "@/icons/LeftArrowIcon"
import { useNavigate } from "react-router-dom"

const PrivacyNoticePage = () => {
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
        <a className="btn btn-ghost text-xl">Privacy Notice</a>
      </div>
      <div className="navbar-end">

      </div>
    </div>
    <div className="flex justify-center">
      <div className="my-2 mx-4 prose">
        <p><strong>Last updated:</strong> 20 June 2025</p>

        <p>
          Your privacy is very important. Safelist is designed with a strong privacy-by-design approach and does not collect or transmit any personal data to the developer or third parties.
        </p>

        <ol>
          <li>
            <strong>Data Storage</strong>
            <ul>
              <li>All notes and folder structures are stored <strong>locally</strong> in your browser using IndexedDB and LocalStorage.</li>
              <li>No user data is transmitted to any remote server controlled by the developer.</li>
            </ul>
          </li>
          <li>
            <strong>Encryption</strong>
            <ul>
              <li>All notes are encrypted using <strong>AES-GCM</strong>.</li>
              <li>The encryption key is derived from your <strong>Master Password</strong> using PBKDF2.</li>
              <li>Encryption and decryption occur entirely <strong>on your device</strong>.</li>
            </ul>
          </li>
          <li>
            <strong>Dropbox and Yandex Disk Integration</strong>
            <ul>
              <li>Cloud synchronization is optional and uses Dropbox OAuth and Yandex OAuth for authentication.</li>
              <li>Only <strong>encrypted data</strong> is uploaded to your Dropbox and/or Yandex Disk account.</li>
              <li>Your Dropbox and/or Yandex access tokens are stored only in your browser and never sent to any third party.</li>
            </ul>
          </li>
          <li>
            <strong>No Analytics or Tracking</strong>
            <ul>
              <li>This application does not use cookies, trackers, analytics, or telemetry.</li>
              <li>No usage data is collected or shared.</li>
            </ul>          
          </li>
          <li>
            <strong>Local-Only Operation</strong>
            <ul>
              <li>All core features (note editing, encryption, folder management) work completely offline.</li>
              <li>You can use the application without an internet connection after the initial load.</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </>
}

export default PrivacyNoticePage;