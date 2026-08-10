package com.cabservice.service.impl;

import com.cabservice.dto.request.LoginRequestDTO;
import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.User;
import com.cabservice.exception.EmailAlreadyExistsException;
import com.cabservice.exception.InvalidCredentialsException;
import com.cabservice.exception.MobileAlreadyExistsException;
import com.cabservice.exception.UserNotFoundException;
import com.cabservice.mapper.AuthMapper;
import com.cabservice.mapper.UserMapper;
import com.cabservice.repository.UserRepository;
import com.cabservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    @Override
    public UserResponseDTO registerUser(UserRequestDTO userRequestDTO) {

        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        if (userRepository.existsByMobileNo(userRequestDTO.getMobileNo())) {
            throw new MobileAlreadyExistsException("Mobile number already registered");
        }

        User user = userMapper.toEntity(userRequestDTO);

        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }

    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                                  .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid email or password");
        }


        return AuthMapper.toLoginResponseDTO(user, "Login successful");
    }

}