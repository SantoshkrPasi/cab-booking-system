package com.cabservice.mapper;

import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.entity.User;
public class AuthMapper {

    public static LoginResponseDTO toLoginResponseDTO(
            User user,
            String message) {

        LoginResponseDTO dto = new LoginResponseDTO();

        dto.setUserId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setEmail(user.getEmail());
        dto.setMessage(message);

        return dto;
    }
}
