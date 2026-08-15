package com.cabservice.mapper;

import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.entity.User;

public class AuthMapper {

    public static LoginResponseDTO toLoginResponseDTO(
            User user,
            String token,
            String message) {

        return LoginResponseDTO.builder()
                               .userId(user.getId())
                               .firstName(user.getFirstName())
                               .email(user.getEmail())
                               .role(user.getRole().name())
                               .token(token)
                               .message(message)
                               .build();
    }
}