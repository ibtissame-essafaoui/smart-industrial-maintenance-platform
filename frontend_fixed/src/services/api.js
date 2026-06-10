import axios from "axios";

// Instance Axios pointant vers le backend Spring Boot
const API = axios.create({
  baseURL: "http://localhost:8080"
});

// ─── INTERCEPTEUR DE REQUÊTES ─────────────────────────────────────────────────
// Ajoute automatiquement le token JWT dans le header Authorization
// de chaque requête sortante (sauf /users/login qui est public)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── INTERCEPTEUR DE RÉPONSES ─────────────────────────────────────────────────
// Si le serveur retourne 401 (non authentifié) ou 403 (accès refusé),
// on efface le localStorage et on redirige vers la page de connexion
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Nettoyer les données d'authentification stockées
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("domain");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      // Rediriger vers la page de connexion
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
