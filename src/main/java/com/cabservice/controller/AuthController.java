package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import com.cabservice.dto.request.LoginRequestDTO;
import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity
                .status(201)
                .body(
                        new ApiResponse<>(true, "User registered successfully",
                                authService.registerUser(userRequestDTO))
                );
    }
@PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity
                .status(200)
                .body(
                        new ApiResponse<>(true, "Login successful",
                                authService.loginUser(request))
                );
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }
}
