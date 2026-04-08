package com.budgetflow.model;

import java.time.Instant;

import com.budgetflow.dto.SignupRequest;

public class PendingSignup {

    private final SignupRequest signupRequest;
    private final String otp;
    private final Instant expiresAt;

    public PendingSignup(SignupRequest signupRequest, String otp, Instant expiresAt) {
        this.signupRequest = signupRequest;
        this.otp = otp;
        this.expiresAt = expiresAt;
    }

    public SignupRequest getSignupRequest() {
        return signupRequest;
    }

    public String getOtp() {
        return otp;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }
}
