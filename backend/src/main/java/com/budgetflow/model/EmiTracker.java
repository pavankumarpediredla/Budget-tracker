package com.budgetflow.model;

public class EmiTracker {

    private Long id;
    private String title;
    private String lender;
    private double monthlyEmi;
    private int monthsRemaining;
    private String startDate;
    private String endDate;

    public EmiTracker(Long id, String title, String lender, double monthlyEmi, int monthsRemaining, String startDate, String endDate) {
        this.id = id;
        this.title = title;
        this.lender = lender;
        this.monthlyEmi = monthlyEmi;
        this.monthsRemaining = monthsRemaining;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLender() {
        return lender;
    }

    public double getMonthlyEmi() {
        return monthlyEmi;
    }

    public int getMonthsRemaining() {
        return monthsRemaining;
    }

    public String getStartDate() {
        return startDate;
    }

    public String getEndDate() {
        return endDate;
    }
}
