package com.budgetflow.model;

public class UserProfile {

    private String title;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String occupation;
    private String company;
    private int age;
    private String imageUrl;
    private String currencyCode;

    public UserProfile(String title, String fullName, String email, String phone, String address, String occupation,
                       String company, int age, String imageUrl, String currencyCode) {
        this.title = title;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.occupation = occupation;
        this.company = company;
        this.age = age;
        this.imageUrl = imageUrl;
        this.currencyCode = currencyCode;
    }

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
