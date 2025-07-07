let btn_purschase = document.getElementById("purchase-btn");
let change_due = document.getElementById("change-due");
let caisse = document.getElementById("caisse");

let price = 100;
let cash_regester = document.getElementById("cash");

let data = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];



function registerChange() {
    let cash = parseFloat(cash_regester.value);

    if (isNaN(cash)) {
        alert("Please enter a valid number.");
        return;
    }

    let registerChange = parseFloat((cash - price).toFixed(2));
    let totalData = Number(data.reduce((total, sum) => total + sum[1], 0).toFixed(2));

    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    } else if (cash === price) {
        change_due.innerText = "No change due - customer paid with exact cash";
        return;
    }

    if (registerChange > totalData) {
        change_due.innerText = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    const denominations = [100, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01];
    const denominationNames = ["ONE HUNDRED", "TWENTY", "TEN", "FIVE", "ONE", "QUARTER", "DIME", "NICKEL", "PENNY"];
    let changeArr = [];

    // Deep copy to avoid mutating original `data`
    let DataCopy = data.map(row => [row[0], row[1]]);

    for (let i = 0; i < denominations.length; i++) {
        let totalDenom = 0;
        let index = DataCopy.length - 1 - i;

        while (registerChange >= denominations[i] && DataCopy[index][1] > 0) {
            DataCopy[index][1] = Number((DataCopy[index][1] - denominations[i]).toFixed(2));
            registerChange = Number((registerChange - denominations[i]).toFixed(2));
            totalDenom += denominations[i];
        }

        if (totalDenom > 0) {
            changeArr.push([denominationNames[i], totalDenom]);
        }
    }

    if (registerChange > 0) {
        change_due.innerText = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    let remainingCid = Number(DataCopy.reduce((total, sum) => total + sum[1], 0).toFixed(2));

    if (remainingCid === 0) {
        change_due.innerHTML = "Status: CLOSED<br><br>" + changeArr.map(
            cash => `${cash[0]}: $${cash[1].toFixed(2)}`
        ).join("<br>");
        data = data.map(denom => [denom[0], 0]);
    } else {
        change_due.innerHTML = "Status: <b>OPEN</b><br><br>" + changeArr.map(
            cash => `<b>${cash[0]}</b>: $${cash[1].toFixed(2)}`
        ).join("<br>");
        data = DataCopy;
    }



    if (typeof displayCashInDrawer === "function") {
        displayCashInDrawer();
    }
}

const displayCashInDrawer = () => {
  caisse.innerHTML = "<h4>Cash in Drawer:</h4>" + data.map(cash => `${cash[0]}: $${cash[1].toFixed(2)} <br>`).reverse().join("");
}

window.onload = displayCashInDrawer;

btn_purschase.addEventListener("click", () => {
    registerChange();
});
