package com.cabservice.service.impl;

import com.cabservice.service.SmsService;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendOtp(
            String mobileNumber,
            String otp) {

        System.out.println(
                "[DEV ONLY] Mobile OTP for "
                        + mobileNumber
                        + " = "
                        + otp
        );
    }
}