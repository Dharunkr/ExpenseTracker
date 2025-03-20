document.addEventListener("DOMContentLoaded", function () {
    fetchExpenses();

    // ✅ Attach event listener to Add Expense form
    document.getElementById("expenseForm").addEventListener("submit", function(event) {
        event.preventDefault();
        addExpense();
    });

    // ✅ Attach event listener for CSV download button
    document.getElementById("downloadCsvBtn").addEventListener("click", downloadCSV);
});

// ✅ Fetch all expenses and display them in the table
function fetchExpenses() {
    fetch("http://localhost:8089/api/expenses")
        .then(response => response.json())
        .then(expenses => {
            const tableBody = document.getElementById("expenseTableBody");
            const totalBalance = document.getElementById("totalBalance");
            tableBody.innerHTML = ""; // Clear existing table data

            let totalAmount = 0;
            expenses.forEach(expense => {
                totalAmount += expense.amount; // Calculate total

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${expense.name}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>
                        <button class="delete-btn" data-id="${expense.id}">❌</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            totalBalance.textContent = `$${totalAmount.toFixed(2)}`; // Update total balance

            // ✅ Attach delete event listeners after table update
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const expenseId = this.getAttribute("data-id");
                    confirmDelete(expenseId);
                });
            });

        })
        .catch(error => console.error("Error fetching expenses:", error));
}

// ✅ Add Expense Function
function addExpense() {
    const expenseData = {
        name: document.getElementById("expenseName").value,
        description: document.getElementById("expenseDescription").value,
        amount: parseFloat(document.getElementById("expenseAmount").value),
        date: document.getElementById("expenseDate").value,
        category: document.getElementById("expenseCategory").value
    };

    console.log("Sending Expense Data:", expenseData); // ✅ Debug Log

    fetch("http://localhost:8089/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success Data:", data);
        alert("Expense added successfully!");
        fetchExpenses(); // ✅ Refresh table immediately
    })
    .catch(error => {
        console.error("Error adding expense:", error);
        alert("Failed to add expense.");
    });
}

// ✅ Show confirmation before deleting an expense
function confirmDelete(expenseId) {
    if (confirm("Are you sure you want to delete this expense?")) {
        deleteExpense(expenseId);
    }
}

// ✅ Delete an expense by ID
function deleteExpense(expenseId) {
    fetch(`http://localhost:8089/api/expenses/${expenseId}`, { method: "DELETE" })
        .then(() => {
            alert("Expense deleted successfully!");
            fetchExpenses(); // Refresh table
        })
        .catch(error => console.error("Error deleting expense:", error));
}

// ✅ Show expense visualization charts
let chartInstance = null; // Store chart instance to prevent duplicates

function showChart() {
    fetch("http://localhost:8089/api/expenses")
        .then(response => response.json())
        .then(expenses => {
            const categoryData = {};
            expenses.forEach(expense => {
                categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
            });

            const ctx = document.getElementById("expenseChart").getContext("2d");

            // Destroy existing chart before rendering a new one
            if (chartInstance !== null) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange"]
                    }]
                }
            });
        })
        .catch(error => console.error("Error fetching chart data:", error));
}

// ✅ Updated CSV Download Function
function downloadCSV() {
    fetch("http://localhost:8089/api/expenses")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }
            return response.json();
        })
        .then(expenses => {
            if (expenses.length === 0) {
                alert("No expenses to download.");
                return;
            }

            // ✅ Create CSV content with proper encoding
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Name,Amount,Date,Category,Description\n"; // Headers

            expenses.forEach(expense => {
                let row = `${expense.name},${expense.amount},${expense.date},${expense.category},${expense.description}`;
                csvContent += row + "\n";
            });

            let encodedUri = encodeURI(csvContent);
            let link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "expenses.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error("Error generating CSV:", error);
            alert("Failed to download CSV.");
        });
}
