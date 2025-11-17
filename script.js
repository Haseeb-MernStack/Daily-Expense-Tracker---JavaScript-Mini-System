const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const totalSpan = document.getElementById("total");
const ctx = document.getElementById("categoryChart").getContext("2d");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Initialize Chart
let categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Category Breakdown',
            data: [],
            backgroundColor: []
        }]
    },
    options: {
        responsive: true
    }
});

// Utility: generate random color
function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Add Expense
addExpenseBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value.trim();
    const date = dateInput.value;

    if (!amount || !category || !date) {
        alert("Please fill all fields");
        return;
    }

    const expense = { amount, category, date };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    amountInput.value = '';
    categoryInput.value = '';
    dateInput.value = '';

    renderExpenses();
    updateChart();
});

// Render Expenses Table
function renderExpenses() {
    expenseTableBody.innerHTML = '';
    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${exp.amount.toFixed(2)}</td>
            <td>${exp.category}</td>
            <td>${exp.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });

    totalSpan.textContent = total.toFixed(2);
}

// Delete Expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    updateChart();
}

// Update Chart
function updateChart() {
    const categoryData = {};
    expenses.forEach(exp => {
        if (!categoryData[exp.category]) categoryData[exp.category] = 0;
        categoryData[exp.category] += exp.amount;
    });

    categoryChart.data.labels = Object.keys(categoryData);
    categoryChart.data.datasets[0].data = Object.values(categoryData);
    categoryChart.data.datasets[0].backgroundColor = Object.keys(categoryData).map(() => getRandomColor());
    categoryChart.update();
}

// Initial render
renderExpenses();
updateChart();
