package com.cabservice.service.impl;

import com.cabservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(
            String email,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "CabGo Email Verification OTP"
        );

        message.setText(
                "Your CabGo verification OTP is: "
                        + otp
                        + "\n\nThis OTP will expire in 5 minutes."
                        + "\n\nDo not share this OTP with anyone."
        );

        mailSender.send(message);
    }
}