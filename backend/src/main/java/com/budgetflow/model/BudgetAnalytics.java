package com.budgetflow.model;

import java.util.List;

public class BudgetAnalytics {

    private final AnalyticsMetric dailySpend;
    private final AnalyticsMetric monthlySpend;
    private final AnalyticsMetric yearlySpend;
    private final AnalyticsMetric balanceInHand;
    private final List<ChartPoint> weeklyTrend;
    private final List<ChartPoint> monthlyTrend;
    private final List<CategorySpend> categoryBreakdown;

    public BudgetAnalytics(AnalyticsMetric dailySpend, AnalyticsMetric monthlySpend, AnalyticsMetric yearlySpend,
                           AnalyticsMetric balanceInHand, List<ChartPoint> weeklyTrend,
                           List<ChartPoint> monthlyTrend, List<CategorySpend> categoryBreakdown) {
        this.dailySpend = dailySpend;
        this.monthlySpend = monthlySpend;
        this.yearlySpend = yearlySpend;
        this.balanceInHand = balanceInHand;
        this.weeklyTrend = weeklyTrend;
        this.monthlyTrend = monthlyTrend;
        this.categoryBreakdown = categoryBreakdown;
    }

    public AnalyticsMetric getDailySpend() {
        return dailySpend;
    }

    public AnalyticsMetric getMonthlySpend() {
        return monthlySpend;
    }

    public AnalyticsMetric getYearlySpend() {
        return yearlySpend;
    }

    public AnalyticsMetric getBalanceInHand() {
        return balanceInHand;
    }

    public List<ChartPoint> getWeeklyTrend() {
        return weeklyTrend;
    }

    public List<ChartPoint> getMonthlyTrend() {
        return monthlyTrend;
    }

    public List<CategorySpend> getCategoryBreakdown() {
        return categoryBreakdown;
    }
}
