package com.budgetflow.dto;

public class LoginResponse {

    private final String username;
    private final String token;
    private final String message;

    public LoginResponse(String username, String token, String message) {
        this.username = username;
        this.token = token;
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}
