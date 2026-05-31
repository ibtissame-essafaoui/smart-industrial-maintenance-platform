package com.example.demo.ws;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserWs {

    private final UserService userService;

    public UserWs(
            UserService userService
    ) {

        this.userService = userService;
    }

    // =====================
    // GET USERS
    // =====================

    @GetMapping
    public List<User> getAll() {

        return userService.getAllUsers();
    }

    // =====================
    // ADD USER
    // =====================

    @PostMapping
    public User save(
            @RequestBody User user
    ) {

        return userService.saveUser(user);
    }

    // =====================
    // DELETE USER
    // =====================

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);
    }

    // =====================
    // LOGIN
    // =====================

    @PostMapping("/login")
    public User login(

            @RequestParam String username,

            @RequestParam String password

    ) {

        return userService.login(
                username,
                password
        );
    }
    // =====================
// UPDATE USER
// =====================

    @PutMapping("/{id}")
    public User update(

            @PathVariable Long id,

            @RequestBody User user

    ) {

        user.setId(id);

        return userService.saveUser(
                user
        );
    }
}