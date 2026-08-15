package com.cabservice.controller;

import com.cabservice.dto.ApiResponse;
import com.cabservice.dto.request.*;
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
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody UserRequestDTO userRequestDTO) {

        authService.startRegistration(userRequestDTO);

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Registration started. OTP sent to email.", null));
    }

    @PostMapping("/register/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String email, @RequestParam String otp) {

        authService.verifyRegistrationEmail(email, otp);

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Email verified successfully. OTP sent to mobile.", null));
    }

    @PostMapping("/register/verify-mobile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> verifyMobile(@RequestParam String mobileNo, @RequestParam String otp) {

        return ResponseEntity.status(201)
                             .body(new ApiResponse<>(true, "Registration completed successfully",
                                     authService.verifyRegistrationMobile(mobileNo, otp)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO request) {

        return ResponseEntity.status(200)
                             .body(new ApiResponse<>(true, "Login successful", authService.loginUser(request)));
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendForgotPasswordOtp(@Valid @RequestBody ForgotPasswordRequestDTO request) {

        authService.sendForgotPasswordOtp(request.getEmail());

        return ResponseEntity.status(200).body(new ApiResponse<>(true, "OTP sent successfully", null));
    }

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyForgotPasswordOtp(@Valid @RequestBody VerifyOtpRequestDTO request) {

        authService.verifyForgotPasswordOtp(request.getEmail(), request.getOtp());

        return ResponseEntity.status(200).body(new ApiResponse<>(true, "OTP verified successfully", null));
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {

        authService.resetPassword(request.getEmail(), request.getNewPassword());

        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully", null));
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }
}