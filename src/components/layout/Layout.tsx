import React from "react";
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";
import { useReactiveVar } from "@apollo/client";
import { tokenVar } from "../../config/client";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../AppSidebar/AppSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const token = useReactiveVar(tokenVar);
  const handleLogout = () => {
    localStorage.removeItem("token");
    tokenVar(null);
  };

  return (
    <main className={styles.main}>
      <nav className={`${styles.nav} w-full fixed`}>
        <div>
          <img src="https://ik.imagekit.io/ashishkk22/simform_logo.svg?updatedAt=1697020836220" alt="simform_logo" />
        </div>
        <div>
          <div>
            <ul className={styles.nav_ul}>
              <li>
                <Link to={"/"} className={styles.nav_link}>
                  Home
                </Link>
              </li>
              <li>
                {token ? (
                  <button onClick={handleLogout} className={styles.nav_link}>
                    Logout
                  </button>
                ) : (
                  <Link to={"/auth/signin"} className={styles.nav_link}>
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="fixed" />
        {children}
      </SidebarProvider>
    </main>
  );
};

export default Layout;
