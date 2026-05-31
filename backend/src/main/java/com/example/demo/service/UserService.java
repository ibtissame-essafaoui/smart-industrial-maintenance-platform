package com.example.demo.service;

import com.example.demo.dao.UserDao;
import com.example.demo.entity.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserDao userDao;

    // Encodeur BCrypt injecté depuis SecurityConfig
    private final PasswordEncoder passwordEncoder;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao         = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    // =====================
    // GET ALL USERS
    // =====================

    public List<User> getAllUsers() {
        return userDao.findAll();
    }

    // =====================
    // SAVE USER
    // =====================

    /**
     * Sauvegarde un utilisateur.
     * Si le mot de passe n'est pas encore hashé avec BCrypt, on le hash automatiquement.
     * Cela gère aussi bien la création que la mise à jour d'un utilisateur.
     */
    public User saveUser(User user) {

        // Hacher le mot de passe s'il n'est pas déjà au format BCrypt ($2a$...)
        if (user.getPassword() != null &&
                !user.getPassword().startsWith("$2a$")) {

            user.setPassword(
                    passwordEncoder.encode(user.getPassword())
            );
        }

        return userDao.save(user);
    }

    // =====================
    // DELETE USER
    // =====================

    public void deleteUser(Long id) {
        userDao.deleteById(id);
    }

    // =====================
    // LOGIN
    // =====================

    /**
     * Vérifie les credentials de l'utilisateur.
     * Gère la migration transparente des mots de passe en clair vers BCrypt :
     * au premier login avec un mot de passe en clair, il est automatiquement hashé en base.
     */
    public User login(String username, String password) {

        User user = userDao.findByUsername(username);

        if (user == null) {
            return null;
        }

        boolean passwordMatch;

        if (user.getPassword().startsWith("$2a$")) {
            // Mot de passe déjà hashé avec BCrypt → comparaison sécurisée
            passwordMatch = passwordEncoder.matches(
                    password,
                    user.getPassword()
            );
        } else {
            // Migration : mot de passe encore en clair → comparaison directe
            passwordMatch = user.getPassword().equals(password);

            if (passwordMatch) {
                // Hasher le mot de passe et le persister pour les prochaines connexions
                user.setPassword(
                        passwordEncoder.encode(password)
                );
                userDao.save(user);
            }
        }

        return passwordMatch ? user : null;
    }
}
