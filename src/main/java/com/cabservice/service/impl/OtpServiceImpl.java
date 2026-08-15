package com.cabservice.service.impl;

import com.cabservice.entity.OtpPurpose;
import com.cabservice.entity.OtpType;
import com.cabservice.entity.OtpVerification;
import com.cabservice.exception.BadRequestException;
import com.cabservice.repository.OtpVerificationRepository;
import com.cabservice.service.EmailService;
import com.cabservice.service.OtpService;
import com.cabservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private final OtpVerificationRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final EmailService emailService;
    private final SmsService smsService;

    @Override
    public void generateAndSendOtp(
            String identifier,
            OtpType type,
            OtpPurpose purpose) {

        String otp = generateOtp();

        OtpVerification otpVerification =
                OtpVerification.builder()
                               .identifier(identifier)
                               .otp(otp)
                               .type(type)
                               .purpose(purpose)
                               .expiresAt(
                                       LocalDateTime.now()
                                                    .plusMinutes(
                                                            OTP_EXPIRY_MINUTES
                                                    )
                               )
                               .attempts(0)
                               .verified(false)
                               .createdAt(LocalDateTime.now())
                               .build();

        otpRepository.save(otpVerification);

        if(type == OtpType.EMAIL) {

            emailService.sendOtp(
                    identifier,
                    otp
            );

        } else if(type == OtpType.MOBILE) {

            smsService.sendOtp(
                    identifier,
                    otp
            );
        }
    }

    @Override
    public boolean verifyOtp(
            String identifier,
            String otp,
            OtpType type,
            OtpPurpose purpose) {

        OtpVerification otpVerification =
                otpRepository
                        .findTopByIdentifierAndTypeAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(
                                identifier,
                                type,
                                purpose
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "OTP not found"
                                )
                        );

        if(otpVerification
                .getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new BadRequestException(
                    "OTP has expired"
            );
        }

        if(otpVerification.getAttempts() >= MAX_ATTEMPTS) {

            throw new BadRequestException(
                    "Maximum OTP attempts exceeded"
            );
        }

        if(! otpVerification.getOtp().equals(otp)) {

            otpVerification.setAttempts(
                    otpVerification.getAttempts() + 1
            );

            otpRepository.save(otpVerification);

            throw new BadRequestException(
                    "Invalid OTP"
            );
        }

        otpVerification.setVerified(true);

        otpRepository.save(otpVerification);

        return true;
    }

    private String generateOtp() {

        int number =
                secureRandom.nextInt(900000) + 100000;

        return String.valueOf(number);
    }
}