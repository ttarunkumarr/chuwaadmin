import React from 'react';
import "./Navbar.css";
const Navbar = ({ backgroundColor, textColor ,buttons,onClick }) => {
  return (
    <nav >
  <img src={require("../assets/oi.png")}/>

      <ul>
   
          {buttons.map((button) => (
          <li key={button.text}>
            <button onClick={() => onClick(button)}>{button.text}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
