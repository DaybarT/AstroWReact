import React, { useState } from "react";
import Navbar from "./Navbar";

export default function Login({ ENV, setSession,setData }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const fetchLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ENV.BASE_URL + ENV.loginAuthor, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          password: password,
        }),
      });

      const result = await response.json();
      console.log(result);
      if (result.status) {
        setSession(true);
      }
      if (!response.ok) {
        setData(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      setData(false);      
      console.log(error);
    }
  };

  const cardStyle = {
    width: "300px",
    padding: "0.6rem",
    textAlign: "center",
    background: "#2a2b38",
    borderRadius: "10px",
  };

  const fieldStyle = {
    marginTop: ".5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: ".5em",
    backgroundColor: "#1f2029",
    borderRadius: "4px",
    padding: ".5em 1em",
  };

  const inputIconStyle = {
    height: "1em",
    width: "1em",
    fill: "#ffeba7",
  };

  const inputFieldStyle = {
    background: "none",
    border: "none",
    outline: "none",
    width: "100%",
    color: "#d3d3d3",
  };

  const titleStyle = {
    marginBottom: "1rem",
    fontSize: "1.0em",
    fontWeight: "500",
    color: "#f5f5f5",
  };

  const btnStyle = {
    margin: "1rem",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: ".8em",
    textTransform: "uppercase",
    padding: "0.6em 1.2em",
    backgroundColor: "#ffeba7",
    color: "#5e6681",
    boxShadow: "0 8px 24px 0 rgb(255 235 167 / 20%)",
    transition: "all .3s ease-in-out",
    cursor:"pointer"
  };
  return (
    <div style={cardStyle}>
      <h4 style={titleStyle}>Log In</h4>
      <form onSubmit={fetchLogin}>
        <div style={fieldStyle}>
          <input
            autoComplete="off"
            placeholder="Usuario"
            style={inputFieldStyle}
            name="user"
            type="text"
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <input
            autoComplete="off"
            placeholder="Contraseña"
            style={inputFieldStyle}
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={btnStyle} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
