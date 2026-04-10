package com.budgetflow.service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.budgetflow.dto.LoginRequest;
import com.budgetflow.dto.LoginResponse;
import com.budgetflow.dto.OtpResponse;
import com.budgetflow.dto.SignupRequest;
import com.budgetflow.dto.VerifyOtpRequest;
import com.budgetflow.model.PendingSignup;
import com.budgetflow.model.RegisteredUser;
import com.budgetflow.model.UserProfile;

@Service
public class AuthService {

    private final Map<String, String> tokens = new ConcurrentHashMap<>();
    private final Map<String, RegisteredUser> usersByUsername = new ConcurrentHashMap<>();
    private final Map<String, RegisteredUser> usersByEmail = new ConcurrentHashMap<>();
    private final Map<String, PendingSignup> pendingSignups = new ConcurrentHashMap<>();
    private final EmailService emailService;
    private final BudgetService budgetService;

    public AuthService(EmailService emailService, BudgetService budgetService) {
        this.emailService = emailService;
        this.budgetService = budgetService;
        RegisteredUser demoUser = new RegisteredUser(
                "demo",
                "demo123",
                new UserProfile(
                        "Mr",
                        "Demo User",
                        "demo@budgetflow.app",
                        "+91 9876500000",
                        "Bengaluru, Karnataka",
                        "Analyst",
                        "BudgetFlow",
                        26,
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
                        "INR"
                )
        );
        usersByUsername.put(demoUser.getUsername().toLowerCase(), demoUser);
        usersByEmail.put(demoUser.getProfile().getEmail().toLowerCase(), demoUser);
        budgetService.initializeDemoUser(demoUser.getUsername(), demoUser.getProfile());
    }

    public LoginResponse login(LoginRequest request) {
        RegisteredUser user = usersByUsername.get(request.getUsername().toLowerCase());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        String token = UUID.randomUUID().toString();
        tokens.put(token, user.getUsername());
        return new LoginResponse(user.getUsername(), token, "Login successful.");
    }

    public OtpResponse signup(SignupRequest request) {
        String usernameKey = request.getUsername().toLowerCase();
        String emailKey = request.getEmail().toLowerCase();

        if (usersByUsername.containsKey(usernameKey)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists.");
        }

        if (usersByEmail.containsKey(emailKey)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists.");
        }

        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 999999));
        pendingSignups.put(emailKey, new PendingSignup(request, otp, Instant.now().plusSeconds(300)));
        emailService.sendOtp(request.getEmail(), otp);
        boolean emailSent = emailService.isEnabled();
        return new OtpResponse(
                "OTP sent successfully. Verify to complete signup.",
                request.getEmail(),
                emailSent ? "" : otp,
                emailSent
        );
    }

    public LoginResponse verifyOtpAndCreateAccount(VerifyOtpRequest request) {
        String emailKey = request.getEmail().toLowerCase();
        PendingSignup pendingSignup = pendingSignups.get(emailKey);

        if (pendingSignup == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No pending signup found for this email.");
        }

        if (Instant.now().isAfter(pendingSignup.getExpiresAt())) {
            pendingSignups.remove(emailKey);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired. Please sign up again.");
        }

        if (!pendingSignup.getOtp().equals(request.getOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP.");
        }

        SignupRequest signupRequest = pendingSignup.getSignupRequest();
        UserProfile profile = new UserProfile(
                signupRequest.getTitle(),
                signupRequest.getFullName(),
                signupRequest.getEmail(),
                signupRequest.getPhone(),
                signupRequest.getAddress(),
                signupRequest.getOccupation(),
                signupRequest.getCompany(),
                signupRequest.getAge(),
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
                signupRequest.getCurrencyCode().toUpperCase()
        );

        RegisteredUser registeredUser = new RegisteredUser(
                signupRequest.getUsername(),
                signupRequest.getPassword(),
                profile
        );

        usersByUsername.put(registeredUser.getUsername().toLowerCase(), registeredUser);
        usersByEmail.put(profile.getEmail().toLowerCase(), registeredUser);
        pendingSignups.remove(emailKey);
        budgetService.initializeNewUser(registeredUser.getUsername(), profile);

        String token = UUID.randomUUID().toString();
        tokens.put(token, registeredUser.getUsername());
        return new LoginResponse(registeredUser.getUsername(), token, "Account verified successfully.");
    }

    public String getUsernameFromToken(String token) {
        String username = tokens.get(token);
        if (username == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing token.");
        }
        return username;
    }
}
