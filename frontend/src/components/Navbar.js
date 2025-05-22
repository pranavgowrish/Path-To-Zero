import React from "react";
import "../styling/NavBar.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSignUpClick = () => {
    navigate("/signUp");
  };

  const handleLogInClick = () => {
    navigate("/logIn");
  };

  return (
    <div>
      <div>
        <button className="home" onClick={handleHomeClick}>
          Home
        </button>
      </div>

      <div>
        <button className="signup" onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>

      <div>
        <button className="login" onClick={handleLogInClick}>
          Log In
        </button>
      </div>

      <div>
        <button className="facts">More Facts!</button>
      </div>
    </div>
  );
}

export default Navbar;
