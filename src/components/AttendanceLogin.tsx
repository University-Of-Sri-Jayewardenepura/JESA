import "../css/AttendanceLogin.css";
import { useState } from "react";

const AttendanceLogin = ({ setUserPermission }: any) => {
  const [enteredCode, setEnteredCode] = useState("");
  const viwerCode = "JESA@2023";
  const editorCode = "JESA@2023OC";
  const superAdminCode = "JESA@2023.OC";

  // event listeners for password field
  const handleEnteredCode = (e: any) => {
    setEnteredCode(e.target.value);
  };

  //granting permission according to each pin
  const grantPermission = () => {
    if (enteredCode === viwerCode) {
      setUserPermission("viewer");
    } else if (enteredCode === editorCode) {
      setUserPermission("editor");
    } else if (enteredCode === superAdminCode) {
      setUserPermission("superAdmin");
    } else {
      setUserPermission("none");
      alert("Incorrect Code");
    }
    setEnteredCode("");
  };

  // render the login page
  return (
    <div className="attendance-login">
      <h2>Enter the code to grant system access</h2>
      <input
        type="password"
        placeholder="Access Code"
        onChange={handleEnteredCode}
        value={enteredCode}
      ></input>
      <div className="login-btn" onClick={grantPermission}>
        Login
      </div>
    </div>
  );
};

export default AttendanceLogin;
