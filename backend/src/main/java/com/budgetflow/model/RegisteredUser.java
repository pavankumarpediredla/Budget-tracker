package com.budgetflow.model;

public class RegisteredUser {

    private final String username;
    private final String password;
    private final UserProfile profile;

    public RegisteredUser(String username, String password, UserProfile profile) {
        this.username = username;
        this.password = password;
        this.profile = profile;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public UserProfile getProfile() {
        return profile;
    }
}
