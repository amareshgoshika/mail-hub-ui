import React, { useState } from "react";
import LoginPage from "../components/LoginPage";
import Header from "../components/Header";
import Profile from "../components/Profile";
import SendEmail from "../components/SendEmail";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  }
  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <LoginPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
};

export default Home;
