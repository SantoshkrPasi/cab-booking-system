package com.cabservice.service;

import com.cabservice.entity.OtpPurpose;
import com.cabservice.entity.OtpType;

public interface OtpService {

    void generateAndSendOtp(
            String identifier,
            OtpType type,
            OtpPurpose purpose
    );

    boolean verifyOtp(
            String identifier,
            String otp,
            OtpType type,
            OtpPurpose purpose
    );
}