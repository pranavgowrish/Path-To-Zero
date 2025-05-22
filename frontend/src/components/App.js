import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import AccountDash from "./AccountDash";
import Quiz from "./Quiz";

function App() {
  return (
    <div className="App">
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/accountDash" element={<AccountDash />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
