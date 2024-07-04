from flask import Flask, render_template, request, jsonify
from datetime import date 
import os
import math

app = Flask(__name__)

slab1 = 250000
slab2 = 500000
slab3 = 1000000
cess = 0.04
planning_years = 100

timeSeriesContainers = {
    'SAVINGS_GROWTH_CONTAINER': 'savingsGrowthContainer',
    'MONTHLY_INFLOW_CONTAINER': 'monthlyInflowContainer',
    'RENT_CONTAINER': 'rentContainer',
    'UTILITY_CONTAINER': 'utilityContainer',
    'MAIDS_CONTAINER': 'maidsContainer',
    'HOME_ESSENTIALS_CONTAINER': 'homeEssentialsContainer',
    'EXISTING_CAR_CONTAINER': 'existingCarContainer',
    'NEW_CAR_CONTAINER': 'newCarContainer',
    'LEISURE_CONTAINER': 'leisureContainer',
    'ASSET_REPAIR_CONTAINER': 'assetRepairContainer',
    'DOMESTIC_TRAVEL_CONTAINER': 'domesticTravelContainer',
    'INTER_TRAVEL_CONTAINER': 'interTravelContainer',
    'MEDICAL_CONTAINER': 'medicalContainer',
    'HRA_INCOME_CONTAINER': 'hraIncomeContainer',
    'BASIC_INCOME_CONTAINER': 'basicIncomeContainer',
    "CHILD_FORMS_CONTAINER" : "child-forms-container"
}

otherDataContainers = {
    'CURRENT_ASSETS': 'currentAssets',
    'EXISTING_PROPERTY_VALUE': 'existingPropertyValue',
    'EXISTING_PROPERTY_APPRECIATION': 'existngPropertyAppreciation',
    'EXISTING_PROPERTY_SALE_YEAR': 'existingPropertySaleYear',
    'NEW_PROPERTY_BUDGET': 'newPropertyBudget',
    'NEW_PROPERTY_APPRECIATION': 'newPropertyAppreciation',
    'NEW_PROPERTY_PURCHASE_YEAR': 'newPropertyPurchaseYear',
    'NEW_PROPERTY_SALE_YEAR': 'newPropertySaleYear',
    'INFLATION_RATE': 'inflationRate',
    'INCOME_TAX': 'incomeTax'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calc_years', methods=['POST'])
def calc_years():
    plannedYears = 100
    data = request.get_json()
    expandedTimeSeriesValuesMatrix = update_all_data_grid(data['timeSeriesData'])
    sustainableYears = getSustainableYears(expandedTimeSeriesValuesMatrix, data['otherData'], plannedYears)

    return jsonify({'years': sustainableYears})

def update_all_data_grid(timeSeriesData):
    expandedTimeSeriesValuesMatrix = {}
    year = date.today().year
    for containerName in timeSeriesData:
        expandedTimeSeriesValuesMatrix[containerName] = {}
        for p in range (0, len(timeSeriesData[containerName])):
            startYear = int(timeSeriesData[containerName][str(p)][0])
            endYear = int(timeSeriesData[containerName][str(p)][1])
            value = float((timeSeriesData[containerName][str(p)][2].replace(',','')))
            growthRate = float(timeSeriesData[containerName][str(p)][3])/100
            for i in range(startYear, endYear):
                expandedTimeSeriesValuesMatrix[containerName][i - year] = round(value * pow(1 + growthRate, i - startYear), 2)
    return expandedTimeSeriesValuesMatrix

def getSustainableYears(expandedTimeSeriesValueData, otherData, plannedYears):
    year = date.today().year
    wealth = float(otherData['currentAssets'].replace(',',''))
    for i in range (0, plannedYears-1):
        for containerName in expandedTimeSeriesValueData:
            if containerName == 'savingsGrowthContainer' or containerName == 'hraIncomeContainer' or containerName == 'basicIncomeContainer':
                continue
            else: 
                if containerName == 'monthlyInflowContainer':
                    if (i in expandedTimeSeriesValueData[containerName]):
                        wealth += 12 * float(expandedTimeSeriesValueData[containerName][i]) * (1 - float(otherData['incomeTax'])/100)
                else:
                    if containerName in expandedTimeSeriesValueData:
                        if (i in expandedTimeSeriesValueData[containerName]):
                            wealth -= 12 * float(expandedTimeSeriesValueData[containerName][i])*pow(1+float(otherData['inflationRate'])/100, i)
        if 'existingPropertyValue' in otherData:
            if year + i == int(otherData['existingPropertySaleYear']):
                wealth += float(otherData['existingPropertyValue']) * pow(1 + float(otherData['existngPropertyAppreciation'])/100, (int(otherData['existingPropertySaleYear']) - year))
        if 'newPropertyBudget' in otherData:
            if year + i == int(otherData['newPropertySaleYear']):
                wealth += float(otherData['newPropertyBudget']) * pow(1 + float(otherData['newPropertyAppreciation'])/100, (int(otherData['newPropertySaleYear']) - year))   
            if year + i == int(otherData['newPropertyPurchaseYear']):
                wealth -= float(otherData['newPropertyBudget']) * pow(1 + float(otherData['newPropertyAppreciation'])/100, (int(otherData['newPropertyPurchaseYear']) - year))          
        wealth *= (1+float(expandedTimeSeriesValueData['savingsGrowthContainer'][i])/100*(1-float(otherData['incomeTax'])/100))
        if wealth <= 0:
            break
    return i

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    app.run(debug=True)