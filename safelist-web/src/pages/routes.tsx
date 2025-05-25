import { createBrowserRouter } from "react-router-dom";
import RootApp from "./app/RootApp";
import LocalLoginPage from "./auth/local-login";
import VaultPage from "./vault";
import NewNotePage from "./vault/new-note";
import EditNotePage from "./vault/edit-note";
import ExportPage from "./export";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootApp />,
    children: [
      {
        path: "/auth/local-login",
        element: <LocalLoginPage />
      },
      {
        path: "/vault",
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
        path: "/export",
        element: <ExportPage />
      },
    ],
  }
]);