package com.budgetflow.dto;

public class OtpResponse {

    private final String message;
    private final String email;
    private final String otpHint;
    private final boolean emailSent;

    public OtpResponse(String message, String email, String otpHint, boolean emailSent) {
        this.message = message;
        this.email = email;
        this.otpHint = otpHint;
        this.emailSent = emailSent;
    }

    public String getMessage() {
        return message;
    }

    public String getEmail() {
        return email;
    }

    public String getOtpHint() {
        return otpHint;
    }

    public boolean isEmailSent() {
        return emailSent;
    }
}
