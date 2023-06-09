import React from "react";
import { auth } from "../config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Navbar from "../Components/Navbar";
import "./Login.css";
function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar backgroundColor="#333" textColor="#fff" buttons={[]} />
      <div className="Login-con">
        <div className="Form-con">
          <h1>Admin</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email"
            />
            <br />

            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
            <br />
            {loading ? (
              <div className="loader">
                <div className="spinner"></div>
              </div>
            ) : (
              <button type="submit">Submit</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
