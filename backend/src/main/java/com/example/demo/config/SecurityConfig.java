package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuration principale de Spring Security.
 * Définit les règles d'autorisation par rôle, le filtre JWT,
 * la gestion CORS et l'encodage des mots de passe.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // =============================================
    // CHAÎNE DE FILTRES DE SÉCURITÉ
    // =============================================

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Désactiver CSRF : inutile pour une API REST stateless
                .csrf(csrf -> csrf.disable())

                // Activer la configuration CORS définie ci-dessous
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Mode stateless : pas de session HTTP (on utilise JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ─── RÈGLES D'AUTORISATION PAR ENDPOINT ──────────────────────────
                .authorizeHttpRequests(auth -> auth

                        // Endpoint de connexion : accessible sans token
                        .requestMatchers(HttpMethod.POST, "/users/login").permitAll()

                        // Documentation Swagger : accessible publiquement
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Gestion des utilisateurs (CRUD) : réservée à l'ADMIN
                        .requestMatchers(HttpMethod.GET,    "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN")

                        // Création / modification / suppression d'équipements : ADMIN seulement
                        .requestMatchers(HttpMethod.POST,   "/equipments").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/equipments/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/equipments/**").hasRole("ADMIN")

                        // Toutes les autres requêtes : utilisateur authentifié (ADMIN ou TECHNICIEN)
                        .anyRequest().authenticated()
                )

                // Ajouter le filtre JWT avant le filtre d'authentification par défaut de Spring
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =============================================
    // CONFIGURATION CORS POUR SPRING SECURITY
    // =============================================

    /**
     * Autorise les requêtes CORS depuis le frontend React (localhost:3000).
     * Cette configuration remplace le CorsConfig.java qui ne s'applique
     * pas correctement quand Spring Security est actif.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Origine autorisée : frontend React en développement
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // Méthodes HTTP autorisées
        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        // Tous les headers sont autorisés (y compris Authorization)
        config.setAllowedHeaders(List.of("*"));

        // Autoriser l'envoi des cookies/credentials
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // =============================================
    // ENCODEUR DE MOTS DE PASSE (BCrypt)
    // =============================================

    /**
     * Bean BCrypt utilisé pour hacher et vérifier les mots de passe.
     * BCrypt est résistant aux attaques par force brute grâce à son facteur de coût.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =============================================
    // GESTIONNAIRE D'AUTHENTIFICATION
    // =============================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
