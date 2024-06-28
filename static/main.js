globalVariables = {
    assetandinflows: 'assetsandinflows',
    monthlyexpenses: 'monthlyexpenses',
    globalsettings: 'globalsettings'
};

errormsg = 'errormsg';

document.getElementById('submit').addEventListener('click', function (e) {
    initiatizeStrings();
    e.preventDefault();
    for (key in globalVariables) {
        form = document.getElementById(globalVariables[key]);
        formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            if (value == "") {
                document.getElementById(errormsg).innerText = `One of more required fields are blank`;
                return;
            }
        }
    }

    //Getting variables to call fetch function
    form = document.getElementById(globalVariables['monthlyexpenses']);
    formData = new FormData(form);

    expenses = 0;
    for (let [key, value] of formData.entries()) {
        expenses += new Number(value);
    }
    savings = document.getElementById('savings').value;

    fetch('/calc_years', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expenses: expenses, savings: savings })
    })
        .then(response => response.json())
        .then(data => document.getElementById('result').innerText = `Your assets will last ${numberWithCommas(data.years)} years    `);

    //Getting variables to call fetch function
    if (document.getElementById('houseinvestments').style.display == 'none')
        return;

    houseBudget = document.getElementById('houseBudget').value;
    houseAppreciation = document.getElementById('houseAppreciation').value;
    purchaseYear = document.getElementById('purchaseYear').value;
    stayPeriod = document.getElementById('stayPeriod').value;
    inflationRate = document.getElementById('inflationRate').value;
    income = document.getElementById('monthlyInflow').value;
    hra = document.getElementById('hra').value;
    rent = document.getElementById('rent_security').value;
    basicIncome = document.getElementById('basic').value;
    isMetro = document.getElementById('isMetroYes').value;
    inflowPeriod = document.getElementById('inflowPeriod').value;

    fetch('/calc_salvage_value', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            houseBudget: houseBudget,
            houseAppreciation: houseAppreciation,
            purchaseYear: purchaseYear,
            stayPeriod: stayPeriod,
            inflationRate: inflationRate,
            income: income,
            hra: hra,
            rent: rent,
            basicIncome: basicIncome,
            isMetro: isMetro,
            inflowPeriod: inflowPeriod
        })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('housesalvagevalue').innerText = `House salvage value at the time of sale: ${numberWithCommas(data.salvageValue)}`;
            document.getElementById('hraloss').innerText = `Cumulative HRA loss: ${numberWithCommas(data.hraLoss)}`;
            window.scrollBy(0, 50);
        });
});

function initiatizeStrings() {
    document.getElementById('result').innerText = "";
    document.getElementById('housesalvagevalue').innerText = "";
    document.getElementById('hraloss').innerText = "";
}

document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    document.getElementById('savingsLabel').innerText = `Total Asset Value as of ${formattedDate}:`;
    document.getElementById('monthlyInflowLabel').innerText = `Monthly in-hand income as of ${formattedDate}:`;
    document.getElementById('houseBudgetLabel').innerText = `Budget as of ${formattedDate}:`;
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

document.getElementById('willPurchase').addEventListener('click', function (e) {
    const conditionalSection = document.getElementById('houseinvestments');
    conditionalSection.style.display = 'block';
});

document.getElementById('wontPurchase').addEventListener('click', function (e) {
    const conditionalSection = document.getElementById('houseinvestments');
    conditionalSection.style.display = 'none';
});