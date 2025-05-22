import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Quiz.css";

function Quiz() {
  const navigate = useNavigate();
  let localStorageUser = null;

  const [quizErrorMessage, setQuizErrorMessage] = useState("");
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    localStorageUser = JSON.parse(storedUser);
  }

  const [quizData, setQuizData] = useState({
    transport: "select",
    miles: "-1",
    home: "select",
    food: "select",
    waste: "select",
    user: localStorageUser["id"],
  });

  useEffect(() => {
    if (!storedUser) {
      navigate("/");
    }
  });

  const handleVarChange = (event) => {
    setQuizData({
      ...quizData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    if (
      quizData["transport"] == "select" ||
      quizData["home"] == "select" ||
      quizData["food"] == "select" ||
      quizData["waste"] == "select"
    ) {
      setQuizErrorMessage("Error: Please select all options!");
    } else if (quizData["miles"] <= "0") {
      setQuizErrorMessage("Error: Miles must be greater than 0");
    } else {
      setQuizErrorMessage("");
      console.log(quizData);
      fetch("https://path-to-zero.onrender.com/quizData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message?.includes("Success")) {
            localStorage.removeItem("data");
            localStorage.setItem("data", JSON.stringify(data.data));
            navigate("/accountDash");
          }
        });
    }
  };

  return (
    <div className="quizBackground">
      <div className="quizContainer">
        <div className="transport">
          <label for="transport">
            What form of transport did you mainly use?
          </label>
          <select name="transport" id="transport" onChange={handleVarChange}>
            <option value="select">Choose an option</option>
            <option value="walking/biking"> Walking/Biking </option>
            <option value="electric/hybrid car"> Electric/Hybrid Cars </option>
            <option value="gas car"> Gasoline Car </option>
            <option value="bus"> Bus </option>
            <option value="train"> Train </option>
            <option value="airplane"> Airplane </option>
          </select>
        </div>

        <div className="miles">
          <label for="miles">
            For how many miles did you use that transportation today?
          </label>
          <input
            type="number"
            placeholder="Number of Miles"
            id="miles"
            name="miles"
            onChange={handleVarChange}
          ></input>
        </div>

        <div className="energy">
          <label for="home"> How energy efficient is your home? </label>
          <select name="home" id="home" onChange={handleVarChange}>
            <option value="select"> Choose an option </option>
            <option value="very"> Very! </option>
            <option value="somewhat"> Somewhat </option>
            <option value="nope"> Not at all :( </option>
          </select>
        </div>

        <div className="food">
          <label for="food">Did you eat animal-based products today?</label>
          <select name="food" id="food" onChange={handleVarChange}>
            <option value="select"> Choose an option </option>
            <option value="every meal"> Every meal </option>
            <option value="one meal"> One meal </option>
            <option value="no beef"> No beef </option>
            <option value="veg"> Vegetarian </option>
            <option value="vegan"> Vegan </option>
          </select>
        </div>

        <div className="waste">
          <label for="waste">
            {" "}
            Did you use the recycling/food waste bins <br /> provided by Waste
            Management today?{" "}
          </label>
          <select name="waste" id="waste" onChange={handleVarChange}>
            <option value="select"> Choose an option </option>
            <option value="yes"> Yes </option>
            <option value="tried"> I try to </option>
            <option value="no"> No </option>
          </select>
        </div>

        <div className="quizSubmit">
          <button type="submit" onClick={handleSubmit}>
            Submit!
          </button>
        </div>

        <div className="quizErrorMessage">
          <p>{quizErrorMessage}</p>
        </div>
      </div>
    </div>
  );
}
export default Quiz;
