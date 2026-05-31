package com.example.demo.service;

import com.example.demo.dao.UserDao;
import com.example.demo.entity.User;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserDao userDao;

    public UserService(
            UserDao userDao
    ) {

        this.userDao = userDao;
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

    public User saveUser(
            User user
    ) {

        return userDao.save(user);
    }

    // =====================
    // DELETE USER
    // =====================

    public void deleteUser(
            Long id
    ) {

        userDao.deleteById(id);
    }

    // =====================
    // LOGIN
    // =====================

    public User login(
            String username,
            String password
    ) {

        User user =
                userDao.findByUsername(
                        username
                );

        if (
                user != null
                        &&
                        user.getPassword()
                                .equals(password)
        ) {

            return user;
        }

        return null;
    }
}