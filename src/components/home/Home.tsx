import Characters from "src/components/character/Character";
import { useState, ReactNode } from "react";
import styles from "./Home.module.css";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { tokenVar } from "../../config/client";

type ExampleComponent = {
  component: ReactNode;
  name: string;
}[];
const Components: ExampleComponent = [{ name: "Apollo GraphQL", component: <Characters /> }];

const LOGIN_MUTATION = gql`
  mutation Login($input: any) {
    login(input: $input) @rest(type: "LoginResponse", path: "/login", method: "POST", bodyKey: "input") {
      token
    }
  }
`;

const Home = () => {
  const [example, setExample] = useState<ExampleComponent[number]>({
    component: <></>,
    name: "Please Select",
  });

  const [login] = useMutation(LOGIN_MUTATION);
  const token = useReactiveVar(tokenVar);

  const handleLogin = async () => {
    // const data = await fetch("https://reqres.in/api/login", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     email: "eve.holt@reqres.in",
    //     password: "cityslicka",
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   }
    // })
    const data = await login({
      variables: {
        input: {
          email: "eve.holt@reqres.in",
          password: "cityslicka",
        },
      },
    });
    localStorage.setItem("token", data?.data?.login?.token);
    tokenVar(data?.data?.login?.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    tokenVar(null);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles["container__heading--size"]}>Welcome to GraphQL POC</h1>
        {token ? <button onClick={handleLogout}>Logout</button> : <button onClick={handleLogin}>Login</button>}
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
