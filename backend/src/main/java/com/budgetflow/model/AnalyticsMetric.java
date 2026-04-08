package com.budgetflow.model;

public class AnalyticsMetric {

    private final String label;
    private final double amount;
    private final String period;

    public AnalyticsMetric(String label, double amount, String period) {
        this.label = label;
        this.amount = amount;
        this.period = period;
    }

    public String getLabel() {
        return label;
    }

    public double getAmount() {
        return amount;
    }

    public String getPeriod() {
        return period;
    }
}
