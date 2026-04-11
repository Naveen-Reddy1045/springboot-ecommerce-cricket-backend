package com.ecom.cricketshop.auth.controller;

import com.ecom.cricketshop.auth.dto.LoginRequest;
import com.ecom.cricketshop.auth.dto.UserRequest;
import com.ecom.cricketshop.auth.service.AuthService;
import com.ecom.cricketshop.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    public AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody UserRequest request) {

        String message = authService.register(request);

        ApiResponse<String> response =
                new ApiResponse<>(true, message, null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(
            @Valid @RequestBody LoginRequest request) {

        String token = authService.login(request);

        ApiResponse<String> response =
                new ApiResponse<>(true, "Login Successful", token);

        return ResponseEntity.ok(response);
    }
}
