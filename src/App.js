import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { auth } from "./config";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import "./App.css";
import Dashboard from "./Screens/Dashboard";
import ResumeInventory from "./Screens/ResumeInventory";
import Link from "./Screens/Linkpage";

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true); 
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
      <Route exact path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route exact path="/">
          {user ? <Dashboard /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/Home">
          {user ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/linkgen">
          {user ? <ResumeInventory /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/mylinks">
          {user ? <Link /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
