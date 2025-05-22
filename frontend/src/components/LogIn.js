import React, { use, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../styling/LogIn.css";

function LogIn() {
  const navigate = useNavigate();

  const [logInForm, setLogInForm] = useState({
    email: "",
    password: "",
  });

  const [backendMessage, setbackendMessage] = useState("");

  let localStorageUser = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    localStorageUser = JSON.parse(storedUser);
  }

  useEffect(() => {
    if (localStorageUser) {
      navigate("/accountDash");
    }
  });

  const handleVarChange = (event) => {
    setLogInForm({
      ...logInForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("https://path-to-zero.onrender.com/logIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logInForm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.includes("Failure")) {
          setbackendMessage("Email/Password is incorrect");
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.data) {
            localStorage.setItem("data", JSON.stringify(data.data));
          }
          navigate("/accountDash");
        }
      });
  };

  const handleRedirectToAccountCreation = (event) => {
    navigate("/signUp");
  };

  return (
    <div className="logInBackground">
      <div>
        <Navbar />
      </div>

      <div>
        <form className="logInFormContainer">
          <div className="emailLogIn">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="passwordLogIn">
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="submitLogIn">
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          <div className="redirectSignUp">
            <button onClick={handleRedirectToAccountCreation}>
              Create an account?
            </button>
          </div>

          <div className="errorLogIn">
            <p>{backendMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
