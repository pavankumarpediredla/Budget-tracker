package com.budgetflow.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.budgetflow.dto.AdviceRequest;
import com.budgetflow.dto.BudgetDashboardResponse;
import com.budgetflow.dto.BudgetPlannerRequest;
import com.budgetflow.dto.EmiSearchRequest;
import com.budgetflow.dto.EmiTrackerRequest;
import com.budgetflow.dto.GoalPlanRequest;
import com.budgetflow.dto.ProfileRequest;
import com.budgetflow.dto.TransactionRequest;
import com.budgetflow.service.AuthService;
import com.budgetflow.service.BudgetService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final AuthService authService;
    private final BudgetService budgetService;

    public BudgetController(AuthService authService, BudgetService budgetService) {
        this.authService = authService;
        this.budgetService = budgetService;
    }

    @GetMapping("/dashboard")
    public BudgetDashboardResponse getDashboard(@RequestHeader("Authorization") String authorization) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.getDashboard();
    }

    @PostMapping("/transactions")
    public BudgetDashboardResponse addTransaction(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody TransactionRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.addTransaction(request);
    }

    @PutMapping("/profile")
    public BudgetDashboardResponse updateProfile(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody ProfileRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.updateProfile(request);
    }

    @PutMapping("/planner")
    public BudgetDashboardResponse updatePlanner(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody BudgetPlannerRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.updatePlanner(request);
    }

    @PostMapping("/goals")
    public BudgetDashboardResponse addGoal(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody GoalPlanRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.addGoal(request);
    }

    @PostMapping("/advice")
    public BudgetDashboardResponse generateAdvice(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody AdviceRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.generateAdvice(request);
    }

    @PostMapping("/emi")
    public BudgetDashboardResponse addEmi(
            @RequestHeader("Authorization") String authorization,
            @Valid @RequestBody EmiTrackerRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.addEmi(request);
    }

    @PutMapping("/emi/{emiId}")
    public BudgetDashboardResponse updateEmi(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long emiId,
            @Valid @RequestBody EmiTrackerRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.updateEmi(emiId, request);
    }

    @PostMapping("/emi/search")
    public BudgetDashboardResponse searchEmi(
            @RequestHeader("Authorization") String authorization,
            @RequestBody EmiSearchRequest request
    ) {
        authService.getUsernameFromToken(extractToken(authorization));
        return budgetService.searchEmi(request);
    }

    private String extractToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return "";
        }
        return authorization.substring(7);
    }
}
