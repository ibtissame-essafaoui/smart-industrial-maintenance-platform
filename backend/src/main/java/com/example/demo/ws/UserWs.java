package com.example.demo.ws;

import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des utilisateurs.
 * Les règles d'autorisation par rôle sont définies dans SecurityConfig.java.
 */
@RestController
@RequestMapping("/users")
public class UserWs {

    private final UserService userService;

    // Utilitaire JWT pour générer le token après connexion réussie
    private final JwtUtil jwtUtil;

    public UserWs(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil     = jwtUtil;
    }

    // =====================
    // GET USERS (ADMIN)
    // =====================

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    // =====================
    // ADD USER (ADMIN)
    // =====================

    @PostMapping
    public User save(@RequestBody User user) {
        return userService.saveUser(user);
    }

    // =====================
    // UPDATE USER (ADMIN)
    // =====================

    @PutMapping("/{id}")
    public User update(
            @PathVariable Long id,
            @RequestBody User user
    ) {
        user.setId(id);
        return userService.saveUser(user);
    }

    // =====================
    // DELETE USER (ADMIN)
    // =====================

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // =====================
    // LOGIN (PUBLIC)
    // =====================

    /**
     * Endpoint de connexion : vérifie les credentials et retourne un token JWT.
     * Accepte un corps JSON { "username": "...", "password": "..." }.
     * Retourne un AuthResponse contenant le token, le rôle et le domaine.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String password = body.get("password");

        // Vérifier les credentials via le service
        User user = userService.login(username, password);

        if (user == null) {
            // Credentials invalides → 401 Unauthorized
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Nom d'utilisateur ou mot de passe incorrect");
        }

        // Générer le token JWT avec username, rôle et domaine
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name(),
                user.getDomain()
        );

        // Retourner le token et les infos de l'utilisateur (sans le mot de passe)
        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getRole().name(),
                        user.getDomain(),
                        user.getUsername(),
                        user.getEmail()
                )
        );
    }
}
