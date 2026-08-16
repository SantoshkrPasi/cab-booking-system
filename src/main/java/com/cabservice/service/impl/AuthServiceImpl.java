package com.cabservice.service.impl;

import com.cabservice.dto.request.LoginRequestDTO;
import com.cabservice.dto.request.UserRequestDTO;
import com.cabservice.dto.response.LoginResponseDTO;
import com.cabservice.dto.response.UserResponseDTO;
import com.cabservice.entity.*;
import com.cabservice.exception.*;
import com.cabservice.mapper.AuthMapper;
import com.cabservice.mapper.UserMapper;
import com.cabservice.repository.OtpVerificationRepository;
import com.cabservice.repository.PendingRegistrationRepository;
import com.cabservice.repository.UserRepository;
import com.cabservice.security.JwtService;
import com.cabservice.service.AuthService;
import com.cabservice.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PendingRegistrationRepository pendingRegistrationRepository;
    private final OtpVerificationRepository otpRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    @Override
    public void startRegistration(UserRequestDTO userRequestDTO) {

        if(userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        if(userRepository.existsByMobileNo(userRequestDTO.getMobileNo())) {
            throw new MobileAlreadyExistsException("Mobile number already registered");
        }

        pendingRegistrationRepository.findByEmail(userRequestDTO.getEmail())
                                     .ifPresent(pendingRegistrationRepository :: delete);

        pendingRegistrationRepository.findByMobileNo(userRequestDTO.getMobileNo())
                                     .ifPresent(pendingRegistrationRepository :: delete);

        String encodedPassword = passwordEncoder.encode(userRequestDTO.getPassword());

        PendingRegistration pendingRegistration = PendingRegistration.builder()
                                                                     .firstName(userRequestDTO.getFirstName())
                                                                     .lastName(userRequestDTO.getLastName())
                                                                     .email(userRequestDTO.getEmail())
                                                                     .mobileNo(userRequestDTO.getMobileNo())
                                                                     .encodedPassword(encodedPassword)
                                                                     .emailVerified(false)
                                                                     .mobileVerified(false)
                                                                     .expiresAt(LocalDateTime.now().plusMinutes(15))
                                                                     .createdAt(LocalDateTime.now())
                                                                     .build();

        pendingRegistrationRepository.save(pendingRegistration);

        otpService.generateAndSendOtp(userRequestDTO.getEmail(), OtpType.EMAIL, OtpPurpose.REGISTRATION);
    }

    @Override
    public void verifyRegistrationEmail(String email, String otp) {

        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByEmail(email)
                                                                               .orElseThrow(
                                                                                       () -> new BadRequestException(
                                                                                               "Pending registration not found"));

        validatePendingRegistration(pendingRegistration);

        otpService.verifyOtp(email, otp, OtpType.EMAIL, OtpPurpose.REGISTRATION);

        pendingRegistration.setEmailVerified(true);

        pendingRegistrationRepository.save(pendingRegistration);

        otpService.generateAndSendOtp(pendingRegistration.getMobileNo(), OtpType.MOBILE, OtpPurpose.REGISTRATION);
    }

    @Override
    public UserResponseDTO verifyRegistrationMobile(String mobileNo, String otp) {

        PendingRegistration pendingRegistration = pendingRegistrationRepository.findByMobileNo(mobileNo)
                                                                               .orElseThrow(
                                                                                       () -> new BadRequestException(
                                                                                               "Pending registration not found"));

        validatePendingRegistration(pendingRegistration);

        if(! Boolean.TRUE.equals(pendingRegistration.getEmailVerified())) {

            throw new BadRequestException("Email verification must be completed first");
        }

        otpService.verifyOtp(mobileNo, otp, OtpType.MOBILE, OtpPurpose.REGISTRATION);

        pendingRegistration.setMobileVerified(true);

        pendingRegistrationRepository.save(pendingRegistration);

        User user = userMapper.toEntity(pendingRegistration);

        User savedUser = userRepository.save(user);

        pendingRegistrationRepository.delete(pendingRegistration);

        return userMapper.toDTO(savedUser);
    }

    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                                  .orElseThrow(() -> new UserNotFoundException("User not found"));

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if(! passwordMatches) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token =
                jwtService.generateToken(user);

        return AuthMapper.toLoginResponseDTO(
                user,
                token,
                "Login successful"
        );
    }

    private void validatePendingRegistration(PendingRegistration pendingRegistration) {

        if(pendingRegistration.getExpiresAt().isBefore(LocalDateTime.now())) {

            pendingRegistrationRepository.delete(pendingRegistration);

            throw new BadRequestException("Registration session has expired. Please register again.");
        }
    }

    @Override
    public void sendForgotPasswordOtp(String email) {

        userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        otpService.generateAndSendOtp(email, OtpType.EMAIL, OtpPurpose.FORGOT_PASSWORD);
    }

    @Override
    public void verifyForgotPasswordOtp(String email, String otp) {

        userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        otpService.verifyOtp(email, otp, OtpType.EMAIL, OtpPurpose.FORGOT_PASSWORD);
    }

    @Override
    public void resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found"));

        OtpVerification verifiedOtp = otpRepository.findTopByIdentifierAndTypeAndPurposeAndVerifiedTrueOrderByCreatedAtDesc(
                                                           email, OtpType.EMAIL, OtpPurpose.FORGOT_PASSWORD)
                                                   .orElseThrow(
                                                           () -> new BadRequestException("OTP verification required"));

        if(verifiedOtp.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new BadRequestException("OTP verification has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        otpRepository.delete(verifiedOtp);
    }
}