package com.example.demo.dto;

/**
 * DTO de réponse pour l'authentification.
 * Retourné au frontend après une connexion réussie.
 * Contient le token JWT et les informations de base de l'utilisateur.
 */
public class AuthResponse {

    // Token JWT à stocker côté client et à envoyer dans chaque requête
    private String token;

    // Rôle de l'utilisateur : ADMIN ou TECHNICIEN
    private String role;

    // Domaine métier du technicien (ex: MECANIQUE, ELECTRIQUE)
    private String domain;

    // Nom d'utilisateur affiché dans l'interface
    private String username;

    public AuthResponse(
            String token,
            String role,
            String domain,
            String username
    ) {
        this.token    = token;
        this.role     = role;
        this.domain   = domain;
        this.username = username;
    }

    // =====================
    // GETTERS
    // =====================

    public String getToken()    { return token; }
    public String getRole()     { return role; }
    public String getDomain()   { return domain; }
    public String getUsername() { return username; }
}
