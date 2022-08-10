import React from "react";
import { Container } from "semantic-ui-react";

import Header from "./Header.js";

const Layout = function ({ children }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
