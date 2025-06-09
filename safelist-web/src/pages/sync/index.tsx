import EditIcon from "@/icons/EditIcon";
import LeftArrowIcon from "@/icons/LeftArrowIcon";
import PlusIcon from "@/icons/PlusIcon";
import { getSecretKey } from "@/store/slices/vaultSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const SyncPage = () => {
  const navigate = useNavigate();
  const secretKey = useSelector(getSecretKey);

  const handleClickBack = () => {
    navigate(-1);
  }

  useEffect(() => {
    const _call = async () => {
      if (!secretKey) {
        navigate("/auth/local-login");
        return;
      }
    }
    _call();
  }, []);

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
        <a className="btn btn-ghost text-xl">Sync Settings</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <ul className="flex bg-base-200 rounded-box w-full justify-between mb-2">
        <div className="flex">
          <ul className="menu menu-horizontal">
            <li>
              <Link to="/sync/yandex-disk">
                <PlusIcon /> Yandex Disk
              </Link>
            </li>
            <li>
              <Link to="/sync/google-drive">
                <PlusIcon /> Google Drive
              </Link>
            </li>
          </ul>
        </div>
      </ul>
    </div>
    <div className="m-4">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="list-row">
          <div className="list-col-grow flex items-center">
            <div>Yandex Disk</div>
          </div>
          <Link className="btn btn-square btn-ghost" to="/sync/yandex-disk">
            <EditIcon />
          </Link>
        </li>
        <li className="list-row">
          <div className="list-col-grow flex items-center">
            <div>Google Drive</div>
          </div>
          <Link className="btn btn-square btn-ghost" to="/sync/google-drive">
            <EditIcon />
          </Link>
        </li>
      </ul>
    </div>
  </>
}

export default SyncPage;