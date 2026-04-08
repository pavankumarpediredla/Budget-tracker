package com.budgetflow.model;

public class Transaction {

    private Long id;
    private String title;
    private String category;
    private TransactionType type;
    private double amount;
    private String date;

    public Transaction(Long id, String title, String category, TransactionType type, double amount, String date) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.type = type;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public TransactionType getType() {
        return type;
    }

    public double getAmount() {
        return amount;
    }

    public String getDate() {
        return date;
    }
}
