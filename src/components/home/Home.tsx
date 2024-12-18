import Characters from "src/components/character/Character";
import { useState, ReactNode } from "react";
import styles from "./Home.module.css";
import { useReactiveVar } from "@apollo/client";
import { tokenVar } from "../../config/client";
import { Link } from "react-router-dom";
import ApolloWithMutation from "../ApolloWithMutation/ApolloWithMutation";

type ExampleComponent = {
  component: ReactNode;
  name: string;
}[];
const Components: ExampleComponent = [
  { name: "Apollo GraphQL", component: <Characters /> },
  { name: "Apollo GraphQL Mutation", component: <ApolloWithMutation /> },
];

const Home = () => {
  const [example, setExample] = useState<ExampleComponent[number]>({
    component: <></>,
    name: "Please Select",
  });

  const token = useReactiveVar(tokenVar);

  const handleLogout = () => {
    localStorage.removeItem("token");
    tokenVar(null);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles["container__heading--size"]}>Welcome to GraphQL POC</h1>
        {token ? <button onClick={handleLogout}>Logout</button> : <Link to={"/auth/signin"}>Login</Link>}
      </div>
      {token && Components.length > 0 && (
        <div className={styles.exContainer}>
          <h2 className={styles.exContainer__heading}>Examples</h2>
          <div className={styles.exContainer__main}>
            <div>
              {Components.map((obj) => {
                return (
                  <div key={obj.name} style={{ cursor: "pointer" }}>
                    <div
                      onClick={() => setExample(obj)}
                      className={obj.name === example.name ? styles["exContainer__sidebar--underline"] : ""}
                    >
                      {obj.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.exContainer__demo}>
              <div className={styles["exContainer__demo--heading"]}>{example?.name + " Example"} </div>
              <div>{example?.component}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
