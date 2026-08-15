package com.cabservice.service.impl;

import com.cabservice.service.SmsService;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImpl implements SmsService {

    @Override
    public void sendOtp(
            String mobileNumber,
            String otp) {

        /*
         * Temporary development implementation.
         *
         * Later this will call an actual SMS provider.
         */
        System.out.println(
                "SMS OTP for "
                        + mobileNumber
                        + " = "
                        + otp
        );
    }
}