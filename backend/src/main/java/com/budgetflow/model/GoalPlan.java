package com.budgetflow.model;

public class GoalPlan {

    private Long id;
    private String title;
    private double targetAmount;
    private double savedAmount;
    private int monthsToTarget;
    private double recommendedMonthlySaving;

    public GoalPlan(Long id, String title, double targetAmount, double savedAmount,
                    int monthsToTarget, double recommendedMonthlySaving) {
        this.id = id;
        this.title = title;
        this.targetAmount = targetAmount;
        this.savedAmount = savedAmount;
        this.monthsToTarget = monthsToTarget;
        this.recommendedMonthlySaving = recommendedMonthlySaving;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public double getTargetAmount() {
        return targetAmount;
    }

    public double getSavedAmount() {
        return savedAmount;
    }

    public int getMonthsToTarget() {
        return monthsToTarget;
    }

    public double getRecommendedMonthlySaving() {
        return recommendedMonthlySaving;
    }
}
