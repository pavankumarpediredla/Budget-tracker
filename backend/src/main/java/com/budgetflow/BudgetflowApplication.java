package com.budgetflow;

import com.budgetflow.config.MailProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(MailProperties.class)
public class BudgetflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgetflowApplication.class, args);
    }
}
