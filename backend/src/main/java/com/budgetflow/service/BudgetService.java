package com.budgetflow.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.budgetflow.dto.AdviceRequest;
import com.budgetflow.dto.BudgetDashboardResponse;
import com.budgetflow.dto.BudgetPlannerRequest;
import com.budgetflow.dto.EmiSearchRequest;
import com.budgetflow.dto.EmiTrackerRequest;
import com.budgetflow.dto.GoalPlanRequest;
import com.budgetflow.dto.ProfileRequest;
import com.budgetflow.dto.TransactionRequest;
import com.budgetflow.model.AiAdvice;
import com.budgetflow.model.AnalyticsMetric;
import com.budgetflow.model.BudgetAllocation;
import com.budgetflow.model.BudgetAnalytics;
import com.budgetflow.model.BudgetPlanner;
import com.budgetflow.model.BudgetSummary;
import com.budgetflow.model.CategorySpend;
import com.budgetflow.model.ChartPoint;
import com.budgetflow.model.EmiTracker;
import com.budgetflow.model.GoalPlan;
import com.budgetflow.model.Transaction;
import com.budgetflow.model.TransactionType;
import com.budgetflow.model.UserProfile;

@Service
public class BudgetService {

    private static final DateTimeFormatter MONTH_LABEL = DateTimeFormatter.ofPattern("MMM");

    private final Map<String, UserBudgetData> budgetsByUsername = new ConcurrentHashMap<>();

    public void initializeDemoUser(String username, UserProfile profile) {
        budgetsByUsername.putIfAbsent(username.toLowerCase(), createDemoState(profile));
    }

    public void initializeNewUser(String username, UserProfile profile) {
        budgetsByUsername.putIfAbsent(username.toLowerCase(), createEmptyState(profile));
    }

    public BudgetDashboardResponse getDashboard(String username) {
        return buildResponse(getUserBudgetData(username), null);
    }

    public BudgetDashboardResponse addTransaction(String username, TransactionRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        TransactionType type = TransactionType.valueOf(request.getType().toUpperCase());
        state.transactions.add(new Transaction(
                state.transactionIdSequence.incrementAndGet(),
                request.getTitle(),
                request.getCategory(),
                type,
                request.getAmount(),
                request.getDate()
        ));
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse updateProfile(String username, ProfileRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        state.profile = new UserProfile(
                request.getTitle(),
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
        state.planner.setCurrencyCode(state.profile.getCurrencyCode());
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse updatePlanner(String username, BudgetPlannerRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        state.planner = new BudgetPlanner(
                request.getMonthlySalary(),
                request.getEmergencyFundTarget(),
                request.getCurrencyCode().toUpperCase(),
                createAllocations(request.getMonthlySalary())
        );
        state.profile.setCurrencyCode(state.planner.getCurrencyCode());
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse addGoal(String username, GoalPlanRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        double remaining = Math.max(0.0, request.getTargetAmount() - request.getSavedAmount());
        double recommendation = request.getMonthsToTarget() == 0 ? 0 : remaining / request.getMonthsToTarget();
        state.goals.add(new GoalPlan(
                state.goalIdSequence.incrementAndGet(),
                request.getTitle(),
                request.getTargetAmount(),
                request.getSavedAmount(),
                request.getMonthsToTarget(),
                recommendation
        ));
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse generateAdvice(String username, AdviceRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        state.aiAdvice = buildAdvice(state, request.getPrompt());
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse addEmi(String username, EmiTrackerRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        state.emiTrackers.add(new EmiTracker(
                state.emiIdSequence.incrementAndGet(),
                request.getTitle(),
                request.getLender(),
                request.getMonthlyEmi(),
                request.getMonthsRemaining(),
                request.getStartDate(),
                request.getEndDate()
        ));
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse updateEmi(String username, Long emiId, EmiTrackerRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        state.emiTrackers.removeIf(emi -> emi.getId().equals(emiId));
        state.emiTrackers.add(new EmiTracker(
                emiId,
                request.getTitle(),
                request.getLender(),
                request.getMonthlyEmi(),
                request.getMonthsRemaining(),
                request.getStartDate(),
                request.getEndDate()
        ));
        return buildResponse(state, null);
    }

    public BudgetDashboardResponse searchEmi(String username, EmiSearchRequest request) {
        UserBudgetData state = getUserBudgetData(username);
        return buildResponse(state, filterEmi(state.emiTrackers, request));
    }

    private UserBudgetData getUserBudgetData(String username) {
        UserBudgetData state = budgetsByUsername.get(username.toLowerCase());
        if (state == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User budget workspace not found.");
        }
        return state;
    }

    private BudgetDashboardResponse buildResponse(UserBudgetData state, List<EmiTracker> filteredEmis) {
        List<Transaction> sortedTransactions = state.transactions.stream()
                .sorted(Comparator.comparing(Transaction::getDate).thenComparing(Transaction::getId).reversed())
                .toList();

        List<EmiTracker> emiTrackersForView = filteredEmis == null
                ? state.emiTrackers.stream()
                        .sorted(Comparator.comparing(EmiTracker::getStartDate))
                        .toList()
                : filteredEmis;

        double totalIncome = state.transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = state.transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double activeMonthlyEmi = emiTrackersForView.stream()
                .filter(emi -> !LocalDate.parse(emi.getEndDate()).isBefore(LocalDate.now()))
                .mapToDouble(EmiTracker::getMonthlyEmi)
                .sum();

        BudgetSummary summary = new BudgetSummary(
                Math.max(0, state.planner.getMonthlySalary() * 0.55 - activeMonthlyEmi),
                totalExpense,
                totalIncome,
                totalIncome - totalExpense - activeMonthlyEmi
        );

        BudgetAnalytics analytics = buildAnalytics(sortedTransactions, summary, activeMonthlyEmi);

        return new BudgetDashboardResponse(
                summary,
                sortedTransactions,
                state.profile,
                state.planner,
                List.copyOf(state.goals),
                state.aiAdvice,
                analytics,
                emiTrackersForView
        );
    }

    private UserBudgetData createDemoState(UserProfile profile) {
        LocalDate today = LocalDate.now();
        List<Transaction> demoTransactions = new ArrayList<>(List.of(
                new Transaction(1L, "Salary Credit", "Salary", TransactionType.INCOME, 85000.00, today.withDayOfMonth(1).toString()),
                new Transaction(2L, "Groceries", "Food", TransactionType.EXPENSE, 2450.00, today.minusDays(1).toString()),
                new Transaction(3L, "Electricity Bill", "Bills", TransactionType.EXPENSE, 1320.00, today.minusDays(3).toString()),
                new Transaction(4L, "Weekend Shopping", "Shopping", TransactionType.EXPENSE, 4200.00, today.minusWeeks(2).toString()),
                new Transaction(5L, "Freelance Income", "Freelance", TransactionType.INCOME, 12500.00, today.minusWeeks(3).toString())
        ));
        List<GoalPlan> demoGoals = new ArrayList<>(List.of(
                new GoalPlan(1L, "Emergency Cushion", 120000.00, 30000.00, 12, 7500.00),
                new GoalPlan(2L, "Buy Laptop", 90000.00, 25000.00, 8, 8125.00)
        ));
        List<EmiTracker> demoEmis = new ArrayList<>(List.of(
                new EmiTracker(1L, "Bike Loan", "HDFC Bank", 3200.00, 10, today.minusMonths(2).withDayOfMonth(1).toString(), today.plusMonths(8).withDayOfMonth(1).toString()),
                new EmiTracker(2L, "Phone EMI", "Bajaj Finance", 1850.00, 6, today.minusMonths(1).withDayOfMonth(1).toString(), today.plusMonths(5).withDayOfMonth(1).toString())
        ));
        BudgetPlanner planner = new BudgetPlanner(85000.00, 200000.00, profile.getCurrencyCode(), createAllocations(85000.00));
        UserBudgetData state = new UserBudgetData(profile, planner, buildAdviceForEmptyPlanner(planner));
        state.transactions.addAll(demoTransactions);
        state.goals.addAll(demoGoals);
        state.emiTrackers.addAll(demoEmis);
        state.transactionIdSequence.set(demoTransactions.stream().mapToLong(Transaction::getId).max().orElse(0));
        state.goalIdSequence.set(demoGoals.stream().mapToLong(GoalPlan::getId).max().orElse(0));
        state.emiIdSequence.set(demoEmis.stream().mapToLong(EmiTracker::getId).max().orElse(0));
        state.aiAdvice = buildAdvice(state, "Help me balance my salary better.");
        return state;
    }

    private UserBudgetData createEmptyState(UserProfile profile) {
        BudgetPlanner planner = new BudgetPlanner(0.0, 0.0, profile.getCurrencyCode(), List.of());
        return new UserBudgetData(profile, planner, new AiAdvice(
                "No advice yet. Add salary, transactions, or goals to generate insights.",
                List.of("No data found yet. Start by completing your profile and adding your first transaction.")
        ));
    }

    private List<BudgetAllocation> createAllocations(double salary) {
        if (salary <= 0) {
            return List.of();
        }
        return List.of(
                new BudgetAllocation("Needs", 40, salary * 0.40),
                new BudgetAllocation("Savings", 20, salary * 0.20),
                new BudgetAllocation("Investments", 15, salary * 0.15),
                new BudgetAllocation("Lifestyle", 10, salary * 0.10),
                new BudgetAllocation("Emergency Fund", 10, salary * 0.10),
                new BudgetAllocation("Future Goals", 5, salary * 0.05)
        );
    }

    private AiAdvice buildAdvice(UserBudgetData state, String prompt) {
        if (state.planner.getMonthlySalary() <= 0) {
            return buildAdviceForEmptyPlanner(state.planner);
        }
        double safeSaving = state.planner.getMonthlySalary() * 0.20;
        double safeLifestyle = state.planner.getMonthlySalary() * 0.10;
        String currencyCode = state.planner.getCurrencyCode();

        return new AiAdvice(
                "Based on your current inputs, keep essential spending controlled, protect emergency reserves, and fund long-term goals before lifestyle upgrades.",
                List.of(
                        "Set aside " + currencyCode + " " + String.format("%.0f", safeSaving) + " every month before optional spending.",
                        "Keep lifestyle spending near " + currencyCode + " " + String.format("%.0f", safeLifestyle) + " to keep your yearly balance healthy.",
                        "For '" + prompt + "', focus first on salary planning, upcoming EMIs, and one priority goal."
                )
        );
    }

    private AiAdvice buildAdviceForEmptyPlanner(BudgetPlanner planner) {
        return new AiAdvice(
                "No advice yet. Add your salary, transactions, or goals to generate personalized suggestions.",
                List.of(
                        "No data found. Update your planner to start building analytics.",
                        "Add your first expense or income entry to unlock daily, monthly, and yearly trends."
                )
        );
    }

    private BudgetAnalytics buildAnalytics(List<Transaction> sortedTransactions, BudgetSummary summary, double activeMonthlyEmi) {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        int currentYear = today.getYear();

        double dailySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> LocalDate.parse(transaction.getDate()).isEqual(today))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double monthlySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> YearMonth.from(LocalDate.parse(transaction.getDate())).equals(currentMonth))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double yearlySpend = sortedTransactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> LocalDate.parse(transaction.getDate()).getYear() == currentYear)
                .mapToDouble(Transaction::getAmount)
                .sum();

        List<ChartPoint> weeklyTrend = new ArrayList<>();
        for (int offset = 6; offset >= 0; offset--) {
            LocalDate day = today.minusDays(offset);
            weeklyTrend.add(pointForDay(sortedTransactions, day.format(MONTH_LABEL) + " " + day.getDayOfMonth(), day));
        }

        List<ChartPoint> monthlyTrend = new ArrayList<>();
        for (int offset = 3; offset >= 0; offset--) {
            YearMonth month = currentMonth.minusMonths(offset);
            monthlyTrend.add(pointForMonth(sortedTransactions, month.format(MONTH_LABEL), month));
        }

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
                new AnalyticsMetric("Monthly spending", monthlySpend, currentMonth.getMonth().name() + " " + currentYear),
                new AnalyticsMetric("Yearly spending", yearlySpend, String.valueOf(currentYear)),
                new AnalyticsMetric("Balance in hand", summary.getSavings(), "After EMI " + String.format("%.0f", activeMonthlyEmi)),
                weeklyTrend,
                monthlyTrend,
                categoryBreakdown
        );
    }

    private List<EmiTracker> filterEmi(List<EmiTracker> emiTrackers, EmiSearchRequest request) {
        return emiTrackers.stream()
                .filter(emi -> request.getMonth() == null || request.getMonth().isBlank()
                        || emi.getStartDate().startsWith(request.getMonth())
                        || emi.getEndDate().startsWith(request.getMonth()))
                .filter(emi -> request.getFromDate() == null || request.getFromDate().isBlank()
                        || emi.getStartDate().compareTo(request.getFromDate()) >= 0)
                .filter(emi -> request.getToDate() == null || request.getToDate().isBlank()
                        || emi.getEndDate().compareTo(request.getToDate()) <= 0)
                .sorted(Comparator.comparing(EmiTracker::getStartDate))
                .toList();
    }

    private ChartPoint pointForDay(List<Transaction> transactions, String label, LocalDate date) {
        double amount = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> LocalDate.parse(transaction.getDate()).isEqual(date))
                .mapToDouble(Transaction::getAmount)
                .sum();
        return new ChartPoint(label, amount);
    }

    private ChartPoint pointForMonth(List<Transaction> transactions, String label, YearMonth month) {
        double amount = transactions.stream()
                .filter(transaction -> transaction.getType() == TransactionType.EXPENSE)
                .filter(transaction -> YearMonth.from(LocalDate.parse(transaction.getDate())).equals(month))
                .mapToDouble(Transaction::getAmount)
                .sum();
        return new ChartPoint(label, amount);
    }

    private static final class UserBudgetData {
        private final AtomicLong transactionIdSequence = new AtomicLong();
        private final AtomicLong goalIdSequence = new AtomicLong();
        private final AtomicLong emiIdSequence = new AtomicLong();
        private final List<Transaction> transactions = new ArrayList<>();
        private final List<GoalPlan> goals = new ArrayList<>();
        private final List<EmiTracker> emiTrackers = new ArrayList<>();
        private UserProfile profile;
        private BudgetPlanner planner;
        private AiAdvice aiAdvice;

        private UserBudgetData(UserProfile profile, BudgetPlanner planner, AiAdvice aiAdvice) {
            this.profile = profile;
            this.planner = planner;
            this.aiAdvice = aiAdvice;
        }
    }
}
