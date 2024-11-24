// global variables
const selectInput = document.getElementById("budget-select");
const nameInput = document.getElementById("income-expense-name");
const amtInput = document.getElementById("input-amount");
const submitBtn = document.getElementById("budget-submit-button");
const budgetForm = document.getElementById("budget-form");
const incomeTableBody = document.getElementById("income-tbody");
const expenseTableBody = document.getElementById("expense-tbody");

class Budget {
	//budget class
	constructor() {
		this.incomeList = JSON.parse(localStorage.getItem('incomeList')) || [];
		this.expenseList = JSON.parse(localStorage.getItem('expenseList')) || [];
	}

	  // Method to save data to localStorage
		saveToLocalStorage() {
			localStorage.setItem('incomeList', JSON.stringify(this.incomeList));
			localStorage.setItem('expenseList', JSON.stringify(this.expenseList));
		}

	appendBudget(values) {
		//method to append to income and/or expense list
		if (selectInput.value === "income") {
			this.incomeList.push(values);
		}
		if (selectInput.value === "expense") {
			this.expenseList.push(values);
		}
		this.saveToLocalStorage();  // Save data to localStorage
	}

	getIncome() {
		//method to return income
		return this.incomeList;
	}

	getExpense() {
		//method to return expense
		return this.expenseList;
	}

	renderTable() {
		incomeTableBody.innerHTML = "";
		expenseTableBody.innerHTML = "";

		// adding row to income table
		this.incomeList.forEach((income, index) => {
			const tableRow = document.createElement("tr");
			tableRow.innerHTML = `<td>${income.name}</td>
									<td>$${income.amount}</td>
									<td>
										<button type="button" class="income-table-del">X</button>
									</td>`;
			incomeTableBody.appendChild(tableRow);
			const delButton = tableRow.querySelector(".income-table-del");
			delButton.addEventListener("click", () => {
				this.removeIncomeItem(index);
			});
		});

		// adding row to expense table
		this.expenseList.forEach((expense, index) => {
			const tableRow = document.createElement("tr");
			tableRow.innerHTML = `<td>${expense.name}</td>
									<td>$${expense.amount}</td>
									<td>
										<button type="button" class="expense-table-del">X</button>
									</td>`;
			expenseTableBody.appendChild(tableRow);
			const delButton = tableRow.querySelector(".expense-table-del");
			delButton.addEventListener("click", () => {
				this.removeExpenseItem(index);
			});
		});

		// displaying income total DOM
		let displayIncomeTotal = document.getElementById("income-total");
		displayIncomeTotal.innerHTML = `Total: ${this.calcIncome()}`;
		// displaying expense total DOM
		let displayExpenseTotal = document.getElementById("expense-total");
		displayExpenseTotal.innerHTML = `Total: ${this.calcExpense()}`;

		// displayin saving percents
		let displaySavingPercent = document.getElementById(
			"tracker-statistics-percent-grid"
		);
		let percents = this.calcPercents();
		displaySavingPercent.innerHTML = 
		`<div>
			<p>
				15% = $${percents.fifteen}
			</p>
		</div>
		<div>
			<p>
				20% = $${percents.twenty}
			</p>
		</div>
		<div>
			<p>
				30% = $${percents.thirty}
			</p>
		</div>
		<div>
			<p>
				40% = $${percents.forty}
			</p>
		</div>`;
	}

	removeIncomeItem(index) {
		this.incomeList.splice(index, 1);
		this.saveToLocalStorage();
		this.renderTable();
	}

	removeExpenseItem(index) {
		this.expenseList.splice(index, 1);
		this.saveToLocalStorage();
		this.renderTable();
	}

	calcIncome() {
		let total = 0;
		this.incomeList.forEach((income) => {
			total = total + parseInt(income.amount);
		});
		return total;
	}

	calcExpense() {
		let total = 0;
		this.expenseList.forEach((expense) => {
			total = total + parseInt(expense.amount);
		});
		return total;
	}

	calcBudget() {
		let total = this.calcIncome() - this.calcExpense();
		return total;
	}

	calcPercents() {
		if(this.calcBudget() < 0){
			let percent ={
				fifteen: 0,
				twenty: 0,
				thirty: 0,
				forty: 0
			};
			return percent
		}else{
			let percent = {
				fifteen: (parseInt(this.calcBudget()) * 0.15).toFixed(2),
				twenty: (parseInt(this.calcBudget()) * 0.2).toFixed(2),
				thirty: (parseInt(this.calcBudget()) * 0.3).toFixed(2),
				forty: (parseInt(this.calcBudget()) * 0.4).toFixed(2),
			};
			return percent;
		}
	}
}

let budget = new Budget(); //creating budget variable with new object budget

if(budget.getIncome().length > 0 || budget.getExpense().length > 0){
	budget.renderTable();
}

// Form validation
budgetForm.addEventListener("submit", (e) => {
	e.preventDefault();

	let nameValue = nameInput.value;
	let amtValue = amtInput.value;

	if (!amtValue || !nameValue) {
		alert("Please enter all inputs");
		return;
	}
	if (parseInt(amtValue) < 0) {
		alert("cannot have negative amount");
		return;
	}

	let formValues = {
		name: nameValue,
		amount: amtValue,
	};

	budget.appendBudget(formValues);
	budget.renderTable();
});





// CHART
const ctx = document.getElementById('myChart');


  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense', 'Budget'],
      datasets: [{
        label: 'Total Amount',
        data: [budget.calcIncome(), budget.calcExpense(), budget.calcBudget()],
        borderWidth: 1
      }]
    }
  });