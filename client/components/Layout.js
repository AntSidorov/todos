import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <Container>
      <Header path={router.asPath} />
      {children}
    </Container>
  );
};

export default Layout;
