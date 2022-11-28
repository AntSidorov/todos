import { Header, List } from "semantic-ui-react";
import Layout from "../components/Layout";
import styles from "../styles/index.module.css";

const Index = () => {
  return (
    <Layout>
      <h1 className={styles.header}>Your own todo list in blockchain!</h1>
      <h1 className={styles.header2}>3 simple steps to use it:</h1>
      <ol className={styles.menu}>
        <li>
          <a href="https://metamask.io/">Install METAMASK</a>
        </li>
        <li>
          <a href="https://goerlifaucet.com/">
            Get some ETH in test network GOERLI
          </a>
        </li>
        <li>
          <a href="/todolist">Go to create your note!</a>
        </li>
      </ol>
    </Layout>
  );
};

export default Index;
