import Characters from "@/components/character/Character";
import { useState, ReactNode } from "react";
import styles from "./Home.module.css";
import { useReactiveVar } from "@apollo/client";
import { tokenVar } from "../../config/client";
import ApolloWithMutation from "../ApolloWithMutation/ApolloWithMutation";
import ApolloWithSubscription from "../ApolloWithSubscription/ApolloWithSubscription";

type ExampleComponent = {
  component: ReactNode;
  name: string;
}[];
const Components: ExampleComponent = [
  { name: "Apollo GraphQL Characters", component: <Characters /> },
  { name: "Apollo GraphQL Characters with Mutation", component: <ApolloWithMutation /> },
  { name: "Apollo GraphQL Subscription Blogs", component: <ApolloWithSubscription /> },
];

const Home = () => {
  const [example, setExample] = useState<ExampleComponent[number]>({
    component: <></>,
    name: "Please Select",
  });
  const token = useReactiveVar(tokenVar);

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles["container__heading--size"]}>Welcome to GraphQL POC</h1>
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
