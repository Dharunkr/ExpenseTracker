document.addEventListener("DOMContentLoaded", function () {
    fetchExpensesForCharts();
});

function fetchExpensesForCharts() {
    fetch("http://localhost:8089/api/expenses")
        .then(response => response.json())
        .then(expenses => {
            generateCategoryChart(expenses);
            generateMonthlyChart(expenses);
        })
        .catch(error => console.error("Error fetching chart data:", error));
}

// ✅ Pie Chart for category-wise expenses
function generateCategoryChart(expenses) {
    const categoryData = {};
    expenses.forEach(expense => {
        categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    new Chart(document.getElementById("categoryChart"), {
        type: "pie",
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ["red", "blue", "green", "yellow", "purple", "orange"]
            }]
        }
    });
}

// ✅ Bar Chart for monthly expense trends
function generateMonthlyChart(expenses) {
    const monthlyData = {};
    expenses.forEach(expense => {
        const month = expense.date.substring(0, 7); // Get YYYY-MM format
        monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    new Chart(document.getElementById("monthlyChart"), {
        type: "bar",
        data: {
            labels: Object.keys(monthlyData),
            datasets: [{
                label: "Total Expenses",
                data: Object.values(monthlyData),
                backgroundColor: "blue"
            }]
        }
    });
}
