package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utilitaire JWT : génération, validation et extraction des claims du token.
 */
@Component
public class JwtUtil {

    // Clé secrète pour signer les tokens (doit faire au moins 256 bits pour HS256)
    private static final String SECRET =
            "SmartIndustrialMaintenancePlatformSecretKey2024!XYZ";

    // Durée de validité du token : 24 heures en millisecondes
    private static final long EXPIRATION_MS = 86_400_000L;

    // =============================================
    // CLÉ DE SIGNATURE
    // =============================================

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // =============================================
    // GÉNÉRATION DU TOKEN
    // =============================================

    /**
     * Génère un token JWT contenant le username, le rôle et le domaine.
     */
    public String generateToken(String username, String role, String domain) {

        Map<String, Object> claims = new HashMap<>();
        // Inclure le rôle dans les claims du token
        claims.put("role", role);
        // Inclure le domaine métier du technicien dans le token
        claims.put("domain", domain);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =============================================
    // EXTRACTION DES CLAIMS
    // =============================================

    /** Extraire le username (subject) depuis le token. */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Extraire le rôle depuis les claims du token. */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /** Extraire le domaine depuis les claims du token. */
    public String extractDomain(String token) {
        return extractClaim(token, claims -> claims.get("domain", String.class));
    }

    /** Méthode générique pour extraire n'importe quelle claim. */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parser le token et retourner toutes les claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =============================================
    // VALIDATION DU TOKEN
    // =============================================

    /** Vérifie si le token est expiré. */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    /**
     * Valide le token : vérifie que le username correspond et que le token n'est pas expiré.
     */
    public boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }
}
