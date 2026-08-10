package com.cabservice.service;

import com.cabservice.dto.request.LoginRequestDTO;
import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;

public interface AuthService {

    UserResponseDTO registerUser(UserRequestDTO userRequestDTO);
    LoginResponseDTO loginUser(LoginRequestDTO request);
}
