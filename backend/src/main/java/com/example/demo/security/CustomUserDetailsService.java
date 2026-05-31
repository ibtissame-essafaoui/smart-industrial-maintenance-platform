package com.example.demo.security;

import com.example.demo.dao.UserDao;
import com.example.demo.entity.User;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service Spring Security : charge les détails de l'utilisateur depuis la base de données.
 * Utilisé par le mécanisme d'authentification pour valider les credentials.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;

    public CustomUserDetailsService(UserDao userDao) {
        this.userDao = userDao;
    }

    // =============================================
    // CHARGEMENT DE L'UTILISATEUR PAR USERNAME
    // =============================================

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Rechercher l'utilisateur dans la base de données
        User user = userDao.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException(
                    "Utilisateur non trouvé : " + username
            );
        }

        // Convertir le rôle en autorité Spring Security (préfixe ROLE_ obligatoire)
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                )
        );
    }
}
