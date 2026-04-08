package com.budgetflow.model;

public class BudgetAllocation {

    private final String category;
    private final double percentage;
    private final double amount;

    public BudgetAllocation(String category, double percentage, double amount) {
        this.category = category;
        this.percentage = percentage;
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public double getPercentage() {
        return percentage;
    }

    public double getAmount() {
        return amount;
    }
}
