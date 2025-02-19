
const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const expenseList = document.getElementById("expense-list");
const filterCategory = document.getElementById("filter-category");
const startDateFilter = document.getElementById("start-date");
const endDateFilter = document.getElementById("end-date");
const applyFiltersBtn = document.getElementById("apply-filters");
const resetFiltersBtn = document.getElementById("reset-filters");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editIndex = -1;

dateInput.max = new Date().toISOString().split("T")[0];

function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-category", expense.category);
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>$${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });
}


expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;


    if (description === "" || isNaN(amount) || amount <= 0 || !date) {
        alert("Please enter valid data!");
        return;
    }

    const newExpense = { description, amount, category, date };

    if (editIndex === -1) {
        expenses.push(newExpense); 
    } else {
        expenses[editIndex] = newExpense; 
        editIndex = -1; 
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    expenseForm.reset();
});


function editExpense(index) {
    const expense = expenses[index];
    descriptionInput.value = expense.description;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;
    editIndex = index;
}

function deleteExpense(index) {
    if (confirm("Are you sure you want to delete this expense?")) {
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderExpenses();
    }
}

applyFiltersBtn.addEventListener("click", function () {
    let filteredExpenses = expenses;

    const selectedCategory = filterCategory.value;
    const startDate = startDateFilter.value;
    const endDate = endDateFilter.value;

    if (selectedCategory !== "all") {
        filteredExpenses = filteredExpenses.filter(expense => expense.category === selectedCategory);
    }

    if (startDate) {
        filteredExpenses = filteredExpenses.filter(expense => new Date(expense.date) >= new Date(startDate));
    }

    if (endDate) {
        filteredExpenses = filteredExpenses.filter(expense => new Date(expense.date) <= new Date(endDate));
    }

    expenseList.innerHTML = "";
    filteredExpenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-category", expense.category);
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>$${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        expenseList.appendChild(row);
    });
});


resetFiltersBtn.addEventListener("click", function () {
    filterCategory.value = "all";
    startDateFilter.value = "";
    endDateFilter.value = "";
    renderExpenses();
});

renderExpenses();
