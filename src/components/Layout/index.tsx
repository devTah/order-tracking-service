import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FunctionComponent = (props) => {
  return (
    <div>
      <Outlet />
      <hr />
    </div>
  );
};

export default Layout;
