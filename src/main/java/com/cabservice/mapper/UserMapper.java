package com.cabservice.mapper;

import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final PasswordEncoder passwordEncoder;

    public UserResponseDTO toDTO(User user) {


        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setMobileNo(user.getMobileNo());

        return dto;
    }

    public User toEntity(UserRequestDTO userRequestDTO) {

        User user = new User();

        user.setFirstName(userRequestDTO.getFirstName());
        user.setLastName(userRequestDTO.getLastName());
        user.setEmail(userRequestDTO.getEmail());
        user.setMobileNo(userRequestDTO.getMobileNo());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        return user;
    }
}