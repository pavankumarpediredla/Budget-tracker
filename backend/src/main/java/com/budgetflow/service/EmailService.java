package com.budgetflow.service;

import com.budgetflow.config.MailProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    public EmailService(JavaMailSender mailSender, MailProperties mailProperties) {
        this.mailSender = mailSender;
        this.mailProperties = mailProperties;
    }

    public boolean isEnabled() {
        return mailProperties.isEnabled() && mailProperties.getFrom() != null && !mailProperties.getFrom().isBlank();
    }

    public void sendOtp(String to, String otp) {
        if (!isEnabled()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailProperties.getFrom());
        message.setTo(to);
        message.setSubject("BudgetFlow OTP Verification");
        message.setText("Your BudgetFlow OTP is " + otp + ". It is valid for 5 minutes.");
        mailSender.send(message);
    }
}
