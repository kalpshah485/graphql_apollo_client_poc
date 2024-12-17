import React from "react";
import { Outlet } from "react-router-dom";

const LayoutAuth = () => {
  return (
    <div>
      <div style={{ margin: "1rem" }}>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;
