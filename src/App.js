import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./scrollToTop";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./components/main/main";
import Detail from "./components/detail/detail";
// import Test from "./test";
function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/detail/device001" replace />} />
        <Route path="/main" element={<Main />} />
        {/* <Route path="/" element={<Test />} /> */}
        <Route path="/detail/:code" element={<Detail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
