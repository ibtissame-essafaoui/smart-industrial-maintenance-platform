import React, { useState } from "react";

import API from "../services/api";

import {
  FaUser,
  FaLock
} from "react-icons/fa";

import "../styles/Login.css";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // CONNEXION
  // =========================

  const login = async () => {

    if (!username || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {

      setLoading(true);

      // Envoi des credentials en corps JSON (plus sécurisé que les query params)
      // Le backend retourne { token, role, domain, username }
      const res = await API.post("/users/login", {
        username,
        password
      });

      // Stocker le token JWT et les infos utilisateur séparément dans le localStorage
      localStorage.setItem("token",    res.data.token);
      localStorage.setItem("role",     res.data.role);
      localStorage.setItem("domain",   res.data.domain);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email",    res.data.email);

      // Redirection selon le rôle de l'utilisateur
      if (res.data.role === "ADMIN") {
        window.location.href = "/";
      } else {
        window.location.href = "/technician";
      }

    } catch (err) {

      console.log(err);
      alert("Nom d'utilisateur ou mot de passe incorrect");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="overlay"></div>

      <div className="login-card">

        {/* TOP */}

        <div className="login-top">

          <div className="logo-wrapper">

            <img
              src="/ocp.png"
              alt="OCP"
              className="ocp-logo"
            />

          </div>

          <h1>
            OCP Smart Maintenance
          </h1>

          <p>
            AI Industrial Monitoring Platform
          </p>

        </div>

        {/* USERNAME */}

        <div className="input-group">

          <FaUser className="input-icon" />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

        </div>

        {/* PASSWORD */}

        <div className="input-group">

          <FaLock className="input-icon" />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
          />

        </div>

        {/* BUTTON */}

        <button
          className="login-btn"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Connexion..." : "LOGIN"}
        </button>

      </div>

    </div>
  );
}

export default Login;
