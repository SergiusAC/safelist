import { createBrowserRouter } from "react-router-dom";
import RootApp from "./app/RootApp";
import LocalLoginPage from "./auth/local-login";
import VaultPage from "./vault";
import NewNotePage from "./vault/new-note";
import EditNotePage from "./vault/edit-note";
import ExportPage from "./export";
import NewFolderPage from "./vault/new-folder";
import HomePage from "./home";
import EditFolderPage from "./vault/edit-folder";
import ImportPage from "./import";
import SyncPage from "./sync";
import YandexSyncPage from "./sync/yandex-sync";
import YandexTokenPage from "./sync/yandex-token";
import DropboxSyncPage from "./sync/dropbox-sync";
import DropboxTokenPage from "./sync/dropbox-token";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootApp />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/auth/local-login",
        element: <LocalLoginPage />
      },
      {
        path: "/vault",
        element: <VaultPage />
      },
      {
        path: "/vault/folder/:folderId",
        element: <VaultPage />
      },
      {
        path: "/vault/new-note",
        element: <NewNotePage />
      },
      {
        path: "/vault/edit-note/:noteId",
        element: <EditNotePage />
      },
      {
        path: "/vault/new-folder",
        element: <NewFolderPage />
      },
      {
        path: "/vault/edit-folder/:folderId",
        element: <EditFolderPage />
      },
      {
        path: "/export",
        element: <ExportPage />
      },
      {
        path: "/import",
        element: <ImportPage />
      },
      {
        path: "/sync",
        element: <SyncPage />
      },
      {
        path: "/sync/yandex-disk",
        element: <YandexSyncPage />
      },
      {
        path: "/sync/yandex-token",
        element: <YandexTokenPage />
      },
      {
        path: "/sync/dropbox",
        element: <DropboxSyncPage />
      },
      {
        path: "/sync/dropbox-token",
        element: <DropboxTokenPage />
      },
    ],
  }
]);