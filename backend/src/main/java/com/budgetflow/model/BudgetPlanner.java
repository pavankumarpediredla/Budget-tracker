package com.budgetflow.model;

import java.util.List;

public class BudgetPlanner {

    private double monthlySalary;
    private double emergencyFundTarget;
    private String currencyCode;
    private List<BudgetAllocation> allocations;

    public BudgetPlanner(double monthlySalary, double emergencyFundTarget, String currencyCode,
                         List<BudgetAllocation> allocations) {
        this.monthlySalary = monthlySalary;
        this.emergencyFundTarget = emergencyFundTarget;
        this.currencyCode = currencyCode;
        this.allocations = allocations;
    }

    public double getMonthlySalary() {
        return monthlySalary;
    }

    public void setMonthlySalary(double monthlySalary) {
        this.monthlySalary = monthlySalary;
    }

    public double getEmergencyFundTarget() {
        return emergencyFundTarget;
    }

    public void setEmergencyFundTarget(double emergencyFundTarget) {
        this.emergencyFundTarget = emergencyFundTarget;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public List<BudgetAllocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<BudgetAllocation> allocations) {
        this.allocations = allocations;
    }
}
