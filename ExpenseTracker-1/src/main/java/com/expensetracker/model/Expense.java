package com.expensetracker.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenses") // Ensure this matches your DB table name
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double amount;
    private String description;

    @Column(name = "date")
    private LocalDate date;

    // ✅ Constructors
    public Expense() {
    }

    public Expense(String name, String category, Double amount, String description, LocalDate date) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.date = date;
    }

    // ✅ Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public Double getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDate() {
        return date;
    }

    // ✅ Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    // ✅ Override toString() for debugging
    @Override
    public String toString() {
        return "Expense{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", date=" + date +
                '}';
    }
}
