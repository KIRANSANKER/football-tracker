package com.tracker.controller;

import com.tracker.entity.User;
import com.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is already registered");
        }

        // IMPORTANT: always set role USER for new signup
        user.setRole(User.Role.USER);

        userRepository.save(user);

        return ResponseEntity.ok("Account created successfully");
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User loginRequest) {

        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (user.getPassword().equals(loginRequest.getPassword())) {

                // Return role + name for frontend
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}