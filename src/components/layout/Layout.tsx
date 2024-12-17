import React from "react";
import { Link } from "react-router-dom";
import styles from "./Layout.module.css";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
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
            </ul>
          </div>
        </div>
      </nav>
      {children}
    </main>
  );
};

export default Layout;
