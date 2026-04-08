package com.budgetflow.model;

public class CategorySpend {

    private final String category;
    private final double amount;

    public CategorySpend(String category, double amount) {
        this.category = category;
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public double getAmount() {
        return amount;
    }
}
