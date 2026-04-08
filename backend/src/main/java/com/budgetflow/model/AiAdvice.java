package com.budgetflow.model;

import java.util.List;

public class AiAdvice {

    private final String summary;
    private final List<String> suggestions;

    public AiAdvice(String summary, List<String> suggestions) {
        this.summary = summary;
        this.suggestions = suggestions;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }
}
