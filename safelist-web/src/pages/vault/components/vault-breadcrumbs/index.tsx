import type { VaultFolderT } from "@/services/vault-service/types";
import type React from "react";
import { Link } from "react-router-dom";

interface Props {
  foldersPath: VaultFolderT[]
}

const VaultBreadcrumbs: React.FC<Props> = ({ foldersPath }) => {
  if (foldersPath.length === 0) {
      return <></>;
  }

  return <>
    <div className="m-2 breadcrumbs text-sm">
      <ul>
        {foldersPath.map(pathItem => (
          <li><Link to={"/vault/folder/" + pathItem.id}>{pathItem.name}</Link></li>
        ))}
      </ul>
    </div>
  </>
};

export default VaultBreadcrumbs;