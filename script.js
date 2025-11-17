// Select DOM elements
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const totalSpan = document.getElementById("total");
const exportBtn = document.getElementById("exportBtn");
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

        // Create cells
        const amountTd = document.createElement("td");
        amountTd.textContent = exp.amount.toFixed(2);

        const categoryTd = document.createElement("td");
        categoryTd.textContent = exp.category;

        const dateTd = document.createElement("td");
        dateTd.textContent = exp.date;

        const actionTd = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteExpense(index));
        actionTd.appendChild(deleteBtn);

        // Append cells to row
        row.appendChild(amountTd);
        row.appendChild(categoryTd);
        row.appendChild(dateTd);
        row.appendChild(actionTd);

        expenseTableBody.appendChild(row);
    });

    totalSpan.textContent = total.toFixed(2);

    if (total > 500) { // example overspending alert
        totalSpan.style.color = 'red';
    } else {
        totalSpan.style.color = 'black';
    }
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

// Export CSV
exportBtn.addEventListener("click", () => {
    if (expenses.length === 0) return alert("No expenses to export");

    const headers = ["Amount", "Category", "Date"];
    const rows = expenses.map(exp => [exp.amount, exp.category, exp.date]);

    let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Initial render
renderExpenses();
updateChart();
