package com.budgetflow.model;

public class BudgetSummary {

    private final double monthlyBudget;
    private final double monthlySpent;
    private final double monthlyIncome;
    private final double savings;

    public BudgetSummary(double monthlyBudget, double monthlySpent, double monthlyIncome, double savings) {
        this.monthlyBudget = monthlyBudget;
        this.monthlySpent = monthlySpent;
        this.monthlyIncome = monthlyIncome;
        this.savings = savings;
    }

    public double getMonthlyBudget() {
        return monthlyBudget;
    }

    public double getMonthlySpent() {
        return monthlySpent;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public double getSavings() {
        return savings;
    }
}
