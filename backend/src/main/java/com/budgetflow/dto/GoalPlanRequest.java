package com.budgetflow.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GoalPlanRequest {

    @NotBlank(message = "Goal title is required.")
    private String title;

    @NotNull(message = "Target amount is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Target amount must be greater than zero.")
    private Double targetAmount;

    @NotNull(message = "Saved amount is required.")
    @DecimalMin(value = "0.0", message = "Saved amount cannot be negative.")
    private Double savedAmount;

    @Min(value = 1, message = "Months to target must be at least 1.")
    private int monthsToTarget;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(Double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public Double getSavedAmount() {
        return savedAmount;
    }

    public void setSavedAmount(Double savedAmount) {
        this.savedAmount = savedAmount;
    }

    public int getMonthsToTarget() {
        return monthsToTarget;
    }

    public void setMonthsToTarget(int monthsToTarget) {
        this.monthsToTarget = monthsToTarget;
    }
}
