globalSections = {
    assetandinflows: 'assets_and_inflows_section',
    monthlyexpenses: 'monthly_expenses_section',
    propertydetails: 'property_section',
    globalsettings: 'global_settings_section'
};

timeSeriesContainers = [
    'savingsGrowthContainer',
    'monthlyInflowContainer',
    'rentContainer',
    'utilityContainer',
    'maidsContainer',
    'homeEssentialsContainer',
    'existingCarContainer',
    'newCarContainer',
    'leisureContainer',
    'assetRepairContainer',
    'domesticTravelContainer',
    'interTravelContainer',
    'medicalContainer',
    'hraIncomeContainer',
    'basicIncomeContainer',
    'child-forms-container'
];

otherDataContainers = [
    'currentAssets',
    'existingPropertyValue',
    'existngPropertyAppreciation',
    'existingPropertySaleYear',
    'newPropertyBudget',
    'newPropertyAppreciation',
    'newPropertyPurchaseYear',
    'newPropertySaleYear',
    'inflationRate',
    'incomeTax'
];

document.getElementById('submit').addEventListener('click', function (e) {
    initiatizeStrings();
    e.preventDefault();
    timeSeriesData = {};
    otherData = {};
    allData = {};
    otherDataCounter = 0;
    for (section in globalSections) {
        form = document.getElementById(globalSections[section]);
        childElements = form.querySelectorAll('*');
        childElements.forEach(child => {
            if (timeSeriesContainers.includes(child.id)) {
                timeSeriesData[child.id] = {};
                timeSeriesElements = child.querySelectorAll('*');
                counter = 0;
                timeSeriesElements.forEach(element => {
                    if (element.className == 'input-row') {
                        timeSeriesData[child.id][counter] = [4];
                        sY = element.querySelector("#startYear").value;
                        eY = element.querySelector("#endYear").value;
                        v = element.querySelector("#value").value;
                        gR = element.querySelector("#growthRate").value;
                        timeSeriesData[child.id][counter++] = [sY, eY, v, gR];
                        if (timeSeriesData[child.id][counter - 1].includes('')) {
                            document.getElementById('errormsg') = "Fields related to " + child.name + " cannot be blank";
                            return;
                        }
                    }
                });
            }
            else if (otherDataContainers.includes(child.id)) {
                if (child.value == '') {
                    document.getElementById('errormsg').innerHTML = "Fields related to " + child.name + " cannot be blank";
                    return;
                }
                otherData[child.id] = child.value;
            }
        });
    }

    allData['timeSeriesData'] = timeSeriesData;
    allData['otherData'] = otherData;

    fetch('/calc_years', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allData)
    })
        .then(response => response.json())
        .then(data => document.getElementById('result').innerText = `Your assets will last ${numberWithCommas(data.years)} years `);
});

function initiatizeStrings() {
    document.getElementById('result').innerText = "";
    document.getElementById('propertysalvagevalue').innerText = "";
    document.getElementById('hraloss').innerText = "";
    document.getElementById('errormsg').innerText = "";
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}