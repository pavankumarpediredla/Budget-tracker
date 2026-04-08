package com.budgetflow.model;

public class ChartPoint {

    private final String label;
    private final double amount;

    public ChartPoint(String label, double amount) {
        this.label = label;
        this.amount = amount;
    }

    public String getLabel() {
        return label;
    }

    public double getAmount() {
        return amount;
    }
}
