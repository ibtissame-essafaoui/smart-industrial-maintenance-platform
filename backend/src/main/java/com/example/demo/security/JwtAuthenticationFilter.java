package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtre JWT : intercepte chaque requête HTTP, extrait et valide le token Bearer.
 * Si le token est valide, l'utilisateur est authentifié dans le SecurityContext.
 * Ce filtre s'exécute une seule fois par requête grâce à OncePerRequestFilter.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    // =============================================
    // TRAITEMENT DU FILTRE
    // =============================================

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Extraire le header Authorization de la requête
        String authHeader = request.getHeader("Authorization");

        // Si le header est absent ou ne commence pas par "Bearer ", passer au filtre suivant
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraire le token en supprimant le préfixe "Bearer "
        String token = authHeader.substring(7);
        String username = null;

        try {
            // Extraire le username depuis le token
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            // Token invalide ou expiré → passer sans authentifier
            filterChain.doFilter(request, response);
            return;
        }

        // Authentifier l'utilisateur si pas encore authentifié dans le contexte de sécurité
        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            // Charger les détails de l'utilisateur depuis la base de données
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            // Valider le token et créer l'objet d'authentification
            if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // Enregistrer l'authentification dans le SecurityContext
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // Continuer la chaîne de filtres
        filterChain.doFilter(request, response);
    }
}
