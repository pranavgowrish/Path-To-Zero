import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../styling/SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  let localStorageUser = null;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    localStorageUser = JSON.parse(storedUser);
  }

  useEffect(() => {
    if (storedUser) {
      navigate("/");
    }
  });

  const [backendMessage, setbackendMessage] = useState("");

  const [userForm, setUserForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    repass: "",
  });

  const handleVarChange = (event) => {
    setUserForm({
      ...userForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    console.log(userForm);
    event.preventDefault();
    fetch("https://path-to-zero.onrender.com/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userForm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message?.includes("Match")) {
          setbackendMessage("Passwords do not match!");
        } else if (data.message?.includes("Account")) {
          setbackendMessage("Account Already Exists! Please Log In");
        } else if (data.message?.includes("Success")) {
          navigate("/logIn");
        }
      });
  };

  const handleRedirectToLogIn = () => {
    navigate("/logIn");
  };

  return (
    <div className="signUpBackground">
      <div>
        <Navbar />
      </div>
      <div>
        <form className="signUpFormContainer">
          <div className="firstNameSignUp">
            <input
              type="text"
              placeholder="First Name"
              id="firstname"
              name="firstname"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="lastNameSignUp">
            <input
              type="text"
              placeholder="Last Name"
              id="lastname"
              name="lastname"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="emailSignUp">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="passwordSignUp">
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="repassSignUp">
            <input
              type="password"
              placeholder="Re-enter Password"
              id="repass"
              name="repass"
              onChange={handleVarChange}
            ></input>
          </div>

          <div className="submitSignUp">
            <button type="submit" onClick={handleSubmit}>
              Submit!
            </button>
          </div>

          <div className="redirectLogIn">
            <button onClick={handleRedirectToLogIn}>
              Already have an account?
            </button>
          </div>

          <div className="errorSignUp">
            <p>{backendMessage}</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
