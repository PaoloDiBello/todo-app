import * as React from "react";
import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Footer from "../src/Footer";
import Homepage from "./Homepage";
import Header from "../src/Header";

const Home: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <div>
        <Header />
        <Homepage />
        <Footer />
      </div>
    </Container>
  );
};

export default Home;
