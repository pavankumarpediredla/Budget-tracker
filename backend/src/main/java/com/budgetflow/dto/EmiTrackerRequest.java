package com.budgetflow.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EmiTrackerRequest {

    @NotBlank(message = "Loan title is required.")
    private String title;

    @NotBlank(message = "Lender is required.")
    private String lender;

    @NotNull(message = "Monthly EMI is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly EMI must be greater than zero.")
    private Double monthlyEmi;

    @Min(value = 1, message = "Months remaining must be at least 1.")
    private int monthsRemaining;

    @NotBlank(message = "Start date is required.")
    private String startDate;

    @NotBlank(message = "End date is required.")
    private String endDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLender() {
        return lender;
    }

    public void setLender(String lender) {
        this.lender = lender;
    }

    public Double getMonthlyEmi() {
        return monthlyEmi;
    }

    public void setMonthlyEmi(Double monthlyEmi) {
        this.monthlyEmi = monthlyEmi;
    }

    public int getMonthsRemaining() {
        return monthsRemaining;
    }

    public void setMonthsRemaining(int monthsRemaining) {
        this.monthsRemaining = monthsRemaining;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
