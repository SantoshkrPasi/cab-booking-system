package com.cabservice.service;

import com.cabservice.dto.request.LoginRequestDTO;
import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;

public interface AuthService {

    void startRegistration(UserRequestDTO userRequestDTO);

    void verifyRegistrationEmail(
            String email,
            String otp
    );

    UserResponseDTO verifyRegistrationMobile(
            String mobileNo,
            String otp
    );

    LoginResponseDTO loginUser(LoginRequestDTO request);

    void sendForgotPasswordOtp(String email);

    void verifyForgotPasswordOtp(
            String email,
            String otp
    );

    void resetPassword(
            String email,
            String newPassword
    );
}