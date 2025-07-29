import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./scrollToTop";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./components/main/main";
import Detail from "./components/detail/detail";
function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/detail/:code" element={<Detail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
