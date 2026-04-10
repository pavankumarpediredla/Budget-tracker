package com.budgetflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ProfileRequest {

    @NotBlank(message = "Title is required.")
    private String title;

    @NotBlank(message = "Full name is required.")
    private String fullName;

    @Email(message = "Email must be valid.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "Phone is required.")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits.")
    private String phone;

    @NotBlank(message = "Address is required.")
    private String address;

    @NotBlank(message = "Occupation is required.")
    private String occupation;

    @NotBlank(message = "Company is required.")
    private String company;

    @Min(value = 18, message = "Age must be at least 18.")
    private int age;

    private String imageUrl;

    @NotBlank(message = "Currency code is required.")
    private String currencyCode;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }
}
