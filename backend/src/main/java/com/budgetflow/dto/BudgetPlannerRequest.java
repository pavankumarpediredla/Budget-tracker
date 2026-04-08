package com.budgetflow.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BudgetPlannerRequest {

    @NotNull(message = "Monthly salary is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly salary must be greater than zero.")
    private Double monthlySalary;

    @NotNull(message = "Emergency fund target is required.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Emergency fund target must be greater than zero.")
    private Double emergencyFundTarget;

    @NotBlank(message = "Currency code is required.")
    private String currencyCode;

    public Double getMonthlySalary() {
        return monthlySalary;
    }

    public void setMonthlySalary(Double monthlySalary) {
        this.monthlySalary = monthlySalary;
    }

    public Double getEmergencyFundTarget() {
        return emergencyFundTarget;
    }

    public void setEmergencyFundTarget(Double emergencyFundTarget) {
        this.emergencyFundTarget = emergencyFundTarget;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }
}
