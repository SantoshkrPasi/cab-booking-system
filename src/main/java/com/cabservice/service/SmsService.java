package com.cabservice.service;

public interface SmsService {

    void sendOtp(
            String mobileNumber,
            String otp
    );
}