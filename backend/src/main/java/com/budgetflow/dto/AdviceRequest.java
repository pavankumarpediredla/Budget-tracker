package com.budgetflow.dto;

import jakarta.validation.constraints.NotBlank;

public class AdviceRequest {

    @NotBlank(message = "Prompt is required.")
    private String prompt;

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}
