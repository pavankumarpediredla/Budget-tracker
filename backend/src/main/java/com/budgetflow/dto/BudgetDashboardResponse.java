package com.budgetflow.dto;

import java.util.List;

import com.budgetflow.model.AiAdvice;
import com.budgetflow.model.BudgetAnalytics;
import com.budgetflow.model.BudgetPlanner;
import com.budgetflow.model.BudgetSummary;
import com.budgetflow.model.EmiTracker;
import com.budgetflow.model.GoalPlan;
import com.budgetflow.model.Transaction;
import com.budgetflow.model.UserProfile;

public class BudgetDashboardResponse {

    private final BudgetSummary summary;
    private final List<Transaction> transactions;
    private final UserProfile profile;
    private final BudgetPlanner planner;
    private final List<GoalPlan> goals;
    private final AiAdvice aiAdvice;
    private final BudgetAnalytics analytics;
    private final List<EmiTracker> emiTrackers;

    public BudgetDashboardResponse(BudgetSummary summary, List<Transaction> transactions, UserProfile profile,
                                   BudgetPlanner planner, List<GoalPlan> goals, AiAdvice aiAdvice,
                                   BudgetAnalytics analytics, List<EmiTracker> emiTrackers) {
        this.summary = summary;
        this.transactions = transactions;
        this.profile = profile;
        this.planner = planner;
        this.goals = goals;
        this.aiAdvice = aiAdvice;
        this.analytics = analytics;
        this.emiTrackers = emiTrackers;
    }

    public BudgetSummary getSummary() {
        return summary;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public BudgetPlanner getPlanner() {
        return planner;
    }

    public List<GoalPlan> getGoals() {
        return goals;
    }

    public AiAdvice getAiAdvice() {
        return aiAdvice;
    }

    public BudgetAnalytics getAnalytics() {
        return analytics;
    }

    public List<EmiTracker> getEmiTrackers() {
        return emiTrackers;
    }
}
