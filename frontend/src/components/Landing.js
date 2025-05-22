import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styling/Landing.css";

function Landing() {
  const navigate = useNavigate();

  let localStorageUser = null;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    localStorageUser = JSON.parse(storedUser);
  }

  useEffect(() => {
    if (storedUser) {
      navigate("/accountDash");
    }
  });
  return (
    <div className="landingBackground">
      <div>
        <Navbar />
      </div>

      <div className="planet1Container"></div>

      <div className="shootingStar"></div>
    </div>
  );
}

export default Landing;
