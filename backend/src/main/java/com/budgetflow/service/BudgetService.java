package com.budgetflow.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.budgetflow.dto.AdviceRequest;
import com.budgetflow.dto.BudgetDashboardResponse;
import com.budgetflow.dto.BudgetPlannerRequest;
import com.budgetflow.dto.EmiSearchRequest;
import com.budgetflow.dto.EmiTrackerRequest;
import com.budgetflow.dto.GoalPlanRequest;
import com.budgetflow.dto.ProfileRequest;
import com.budgetflow.dto.TransactionRequest;
import com.budgetflow.model.AiAdvice;
import com.budgetflow.model.BudgetAllocation;
import com.budgetflow.model.BudgetAnalytics;
import com.budgetflow.model.BudgetPlanner;
import com.budgetflow.model.BudgetSummary;
import com.budgetflow.model.AnalyticsMetric;
import com.budgetflow.model.CategorySpend;
import com.budgetflow.model.ChartPoint;
import com.budgetflow.model.EmiTracker;
import com.budgetflow.model.GoalPlan;
import com.budgetflow.model.Transaction;
import com.budgetflow.model.TransactionType;
import com.budgetflow.model.UserProfile;

@Service
public class BudgetService {

    private final AtomicLong transactionIdSequence = new AtomicLong(4);
    private final AtomicLong goalIdSequence = new AtomicLong(3);
    private final AtomicLong emiIdSequence = new AtomicLong(3);
    private final List<Transaction> transactions = new ArrayList<>(
            List.of(
                    new Transaction(1L, "April Salary", "Salary", TransactionType.INCOME, 3200.00, "2026-04-01"),
                    new Transaction(2L, "Groceries", "Food", TransactionType.EXPENSE, 145.75, "2026-04-03"),
                    new Transaction(3L, "Electricity Bill", "Bills", TransactionType.EXPENSE, 92.10, "2026-04-05"),
                    new Transaction(4L, "Commute Pass", "Transport", TransactionType.EXPENSE, 58.00, "2026-04-06"),
                    new Transaction(5L, "Coffee Meetup", "Lifestyle", TransactionType.EXPENSE, 22.50, "2026-04-07"),
                    new Transaction(6L, "Freelance Payment", "Freelance", TransactionType.INCOME, 850.00, "2026-03-22"),
                    new Transaction(7L, "Shopping Order", "Shopping", TransactionType.EXPENSE, 210.00, "2026-02-18"),
                    new Transaction(8L, "Medical Checkup", "Health", TransactionType.EXPENSE, 95.00, "2026-01-12"),
                    new Transaction(9L, "Bonus", "Salary", TransactionType.INCOME, 500.00, "2026-04-08")
            )
    );
    private final List<GoalPlan> goals = new ArrayList<>(
            List.of(
                    new GoalPlan(1L, "Buy Laptop", 90000.00, 25000.00, 8, 8125.00),
                    new GoalPlan(2L, "Emergency Cushion", 120000.00, 30000.00, 12, 7500.00)
            )
    );
    private final List<EmiTracker> emiTrackers = new ArrayList<>(
            List.of(
                    new EmiTracker(1L, "Bike Loan", "HDFC Bank", 3200.00, 10, "2026-02-01", "2026-11-01"),
                    new EmiTracker(2L, "Phone EMI", "Bajaj Finance", 1850.00, 6, "2026-04-01", "2026-09-01")
            )
    );
    private UserProfile profile = new UserProfile(
            "Pavan Kumar",
            "pavan@example.com",
            "+91 9876543210",
            "Bengaluru, Karnataka",
            "Software Engineer",
            "LocalKart Labs",
            27,
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            "INR"
    );
    private BudgetPlanner planner = new BudgetPlanner(
            85000.00,
            200000.00,
            "INR",
            createAllocations(85000.00)
    );
    private AiAdvice aiAdvice = buildAdvice("Help me balance my salary better.");

    public BudgetDashboardResponse getDashboard() {
        return buildResponse();
    }

    public BudgetDashboardResponse addTransaction(TransactionRequest request) {
        TransactionType type = TransactionType.valueOf(request.getType().toUpperCase());
        transactions.add(new Transaction(
                transactionIdSequence.getAndIncrement(),
                request.getTitle(),
                request.getCategory(),
                type,
                request.getAmount(),
                request.getDate()
        ));
        return buildResponse();
    }

    public BudgetDashboardResponse updateProfile(ProfileRequest request) {
        profile = new UserProfile(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getOccupation(),
                request.getCompany(),
                request.getAge(),
                request.getImageUrl(),
                request.getCurrencyCode().toUpperCase()
        );
        planner.setCurrencyCode(profile.getCurrencyCode());
        return buildResponse();
    }

    public BudgetDashboardResponse updatePlanner(BudgetPlannerRequest request) {
        planner = new BudgetPlanner(
                request.getMonthlySalary(),
                request.getEmergencyFundTarget(),
                request.getCurrencyCode().toUpperCase(),
                createAllocations(request.getMonthlySalary())
        );
        profile.setCurrencyCode(planner.getCurrencyCode());
        return buildResponse();
    }

    public BudgetDashboardResponse addGoal(GoalPlanRequest request) {
        double remaining = Math.max(0.0, request.getTargetAmount() - request.getSavedAmount());
        double recommendation = remaining / request.getMonthsToTarget();
        goals.add(new GoalPlan(
                goalIdSequence.getAndIncrement(),
                request.getTitle(),
                request.getTargetAmount(),
                request.getSavedAmount(),
                request.getMonthsToTarget(),
                recommendation
        ));
        return buildResponse();
    }

    public BudgetDashboardResponse generateAdvice(AdviceRequest request) {
        aiAdvice = buildAdvice(request.getPrompt());
        return buildResponse();
    }

    public BudgetDashboardResponse addEmi(EmiTrackerRequest request) {
        emiTrackers.add(new EmiTracker(
                emiIdSequence.getAndIncrement(),
                request.getTitle(),
                request.getLender(),
                request.getMonthlyEmi(),
                request.getMonthsRemaining(),
                request.getStartDate(),
                request.getEndDate()
        ));
        return buildResponse();
    }

    public BudgetDashboardResponse updateEmi(Long emiId, EmiTrackerRequest request) {
        emiTrackers.removeIf(emi -> emi.getId().equals(emiId));
        emiTrackers.add(new EmiTracker(
                emiId,
                request.getTitle(),
                request.getLender(),
                request.getMonthlyEmi(),
                request.getMonthsRemaining(),
                request.getStartDate(),
                request.getEndDate()
        ));
        return buildResponse();
    }

    public BudgetDashboardResponse searchEmi(EmiSearchRequest request) {
        return buildResponse(filterEmi(request));
    }

    private BudgetDashboardResponse buildResponse() {
        return buildResponse(List.copyOf(emiTrackers));
    }

    private BudgetDashboardResponse buildResponse(List<EmiTracker> emiTrackersForView) {
        List<Transaction> sortedTransactions = transactions.stream()
                .sorted(Comparator.comparing(Transaction::getId).reversed())
                .toList();

        double monthlyIncome = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double monthlySpent = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double activeMonthlyEmi = emiTrackersForView.stream()
                .mapToDouble(EmiTracker::getMonthlyEmi)
                .sum();

        BudgetSummary summary = new BudgetSummary(
                Math.max(0, planner.getMonthlySalary() * 0.55 - activeMonthlyEmi),
                monthlySpent,
                monthlyIncome,
                planner.getMonthlySalary() - monthlySpent - activeMonthlyEmi
        );

        BudgetAnalytics analytics = buildAnalytics(sortedTransactions, summary, activeMonthlyEmi);

        return new BudgetDashboardResponse(
                summary,
                sortedTransactions,
                profile,
                planner,
                List.copyOf(goals),
                aiAdvice,
                analytics,
                emiTrackersForView
        );
    }

    private List<BudgetAllocation> createAllocations(double salary) {
        return List.of(
                new BudgetAllocation("Needs", 40, salary * 0.40),
                new BudgetAllocation("Savings", 20, salary * 0.20),
                new BudgetAllocation("Investments", 15, salary * 0.15),
                new BudgetAllocation("Lifestyle", 10, salary * 0.10),
                new BudgetAllocation("Emergency Fund", 10, salary * 0.10),
                new BudgetAllocation("Future Goals", 5, salary * 0.05)
        );
    }

    private AiAdvice buildAdvice(String prompt) {
        double safeSaving = planner.getMonthlySalary() * 0.20;
        double safeLifestyle = planner.getMonthlySalary() * 0.10;
        String summary = "Based on your current salary, keep your essential spending controlled, maintain a fixed savings discipline, and fund goals before lifestyle expansion.";

        List<String> suggestions = List.of(
                "Set aside " + planner.getCurrencyCode() + " " + String.format("%.0f", safeSaving) + " every month for savings before discretionary spending.",
                "Keep lifestyle spending close to " + planner.getCurrencyCode() + " " + String.format("%.0f", safeLifestyle) + " so your future goals stay realistic.",
                "For prompt '" + prompt + "', prioritize the Future Goals and Emergency Fund buckets before shopping upgrades."
        );

        return new AiAdvice(summary, suggestions);
    }

    private BudgetAnalytics buildAnalytics(List<Transaction> sortedTransactions, BudgetSummary summary, double activeMonthlyEmi) {
        double dailySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.getDate().equals("2026-04-08"))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double monthlySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.getDate().startsWith("2026-04"))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double yearlySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.getDate().startsWith("2026"))
                .mapToDouble(Transaction::getAmount)
                .sum();

        List<ChartPoint> weeklyTrend = List.of(
                pointForDay(sortedTransactions, "Apr 02", "2026-04-02"),
                pointForDay(sortedTransactions, "Apr 03", "2026-04-03"),
                pointForDay(sortedTransactions, "Apr 04", "2026-04-04"),
                pointForDay(sortedTransactions, "Apr 05", "2026-04-05"),
                pointForDay(sortedTransactions, "Apr 06", "2026-04-06"),
                pointForDay(sortedTransactions, "Apr 07", "2026-04-07"),
                pointForDay(sortedTransactions, "Apr 08", "2026-04-08")
        );

        List<ChartPoint> monthlyTrend = List.of(
                pointForMonth(sortedTransactions, "Jan", "2026-01"),
                pointForMonth(sortedTransactions, "Feb", "2026-02"),
                pointForMonth(sortedTransactions, "Mar", "2026-03"),
                pointForMonth(sortedTransactions, "Apr", "2026-04")
        );

        List<CategorySpend> categoryBreakdown = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(Transaction::getCategory, Collectors.summingDouble(Transaction::getAmount)))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(entry -> new CategorySpend(entry.getKey(), entry.getValue()))
                .toList();

        return new BudgetAnalytics(
                new AnalyticsMetric("Daily spending", dailySpend, "Today"),
                new AnalyticsMetric("Monthly spending", monthlySpend, "April 2026"),
                new AnalyticsMetric("Yearly spending", yearlySpend, "2026"),
                new AnalyticsMetric("Balance in hand", summary.getSavings(), "After EMI " + String.format("%.0f", activeMonthlyEmi)),
                weeklyTrend,
                monthlyTrend,
                categoryBreakdown
        );
    }

    private List<EmiTracker> filterEmi(EmiSearchRequest request) {
        return emiTrackers.stream()
                .filter(emi -> request.getMonth() == null || request.getMonth().isBlank()
                        || emi.getStartDate().startsWith(request.getMonth())
                        || emi.getEndDate().startsWith(request.getMonth()))
                .filter(emi -> request.getFromDate() == null || request.getFromDate().isBlank()
                        || emi.getStartDate().compareTo(request.getFromDate()) >= 0)
                .filter(emi -> request.getToDate() == null || request.getToDate().isBlank()
                        || emi.getEndDate().compareTo(request.getToDate()) <= 0)
                .toList();
    }

    private ChartPoint pointForDay(List<Transaction> transactions, String label, String date) {
        double amount = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.getDate().equals(date))
                .mapToDouble(Transaction::getAmount)
                .sum();
        return new ChartPoint(label, amount);
    }

    private ChartPoint pointForMonth(List<Transaction> transactions, String label, String monthPrefix) {
        double amount = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.getDate().startsWith(monthPrefix))
                .mapToDouble(Transaction::getAmount)
                .sum();
        return new ChartPoint(label, amount);
    }
}
