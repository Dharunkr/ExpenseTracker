package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ExpenseService {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository; // Inject repository

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // ✅ Fetch all expenses
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // ✅ Save (add) expense - Fixed method name
    public Expense addExpense(Expense expense) {
        if (expense == null) {
            logger.error("Attempted to save a null expense!");
            throw new IllegalArgumentException("Expense cannot be null");
        }
        Expense savedExpense = expenseRepository.save(expense);
        logger.info("Added new expense: {}", savedExpense);
        return savedExpense;
    }

    // ✅ Get Expense by ID
    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    // ✅ Delete expense by ID (with check)
    public boolean deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            logger.info("Deleted expense with ID: {}", id);
            return true;
        } else {
            logger.warn("Expense ID {} not found, delete failed!", id);
            return false;
        }
    }
}
