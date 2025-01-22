import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className="w-full">
      <div className={`${styles.container} mt-[72px]`}>
        <h1 className={styles["container__heading--size"]}>Welcome to GraphQL POC</h1>
      </div>
    </div>
  );
};

export default Home;
