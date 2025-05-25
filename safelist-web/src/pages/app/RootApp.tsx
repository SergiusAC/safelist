import type React from "react";
import { Outlet } from "react-router-dom";

const RootApp: React.FC = () => {
  return <>
    <Outlet />
  </>;
};

export default RootApp;