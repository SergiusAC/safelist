import { useLocation, useParams } from "react-router-dom";

const YandexTokenPage = () => {
  const { hash } = useLocation();
  const query = new URLSearchParams(hash.replace("#", ""));

  const copy = async () => {
    await navigator.clipboard.writeText(query.get("access_token") || "");
    alert("Token copied to Clipboard");
  }

  return <>
    <div className="navbar bg-base-100">
      <div className="navbar-start">
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Yandex API Token</a>
      </div>
      <div className="navbar-end">
      </div>
    </div>
    <div className="m-4">
      <div className="p-2 bg-gray-200 rounded">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-sm">Token</legend>
          <textarea className="input w-full h-15 text-wrap" value={query.get("access_token") || ""} />
          <span className="text-sm">Copy the token and paste in the Yandex Sync Settings</span>
          <button className="btn btn-primary mt-2" onClick={copy}>Copy</button>
        </fieldset>
      </div>
    </div>
  </>
}

export default YandexTokenPage;