package com.budgetflow.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.budgetflow.dto.LoginRequest;
import com.budgetflow.dto.LoginResponse;
import com.budgetflow.dto.OtpResponse;
import com.budgetflow.dto.SignupRequest;
import com.budgetflow.dto.VerifyOtpRequest;
import com.budgetflow.service.AuthService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    public OtpResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/verify-otp")
    public LoginResponse verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return authService.verifyOtpAndCreateAccount(request);
    }
}
