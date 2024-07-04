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
   
    # periods = data['monthly_income_periods']
    # values = data['monthly_income_values']
    # timeseries_datagrid['year_wise_monthly_income'] = update_all_data_grid(periods, values)

    # periods = data['savings_growthrate_periods']
    # values = data['savings_growthrate_values']
    # timeseries_datagrid['year_wise_savings_growthrate'] = update_all_data_grid(periods, values)

    # periods = data['rent_periods']
    # values = data['rent_values']
    # timeseries_datagrid['year_wise_rent'] = update_all_data_grid(periods, values)
    


    # data = request.get_json()
    # expenses = data['expenses']
    # savings = data['savings']
    # data = request.get_json()
    # houseBudget = float(data['houseBudget'])
    # houseAppreciation = float(data['houseAppreciation']) / 100
    # purchaseYear = float(data['purchaseYear'])
    # stayPeriod = float(data['stayPeriod'])
    # inflation_rate = float(data['inflationRate']) / 100
    # monthly_income = float(data['income'])
    # hra = float(data['hra'])
    # rent = float(data['rent'])
    # basicIncome = float(data['basicIncome'])
    # isMetro = data['isMetro']
    # service_years = float(data['inflowPeriod'])
    # wealth_growth_rate = float(data['wealth_growth_rate'])/100
    # income_tax_rate = float(data['income_tax_rate'])/100
    # salary_growth_rate = float(data['salary_growth_rate'])/100

    # year1_wealth = savings * math.pow(1 + wealth_growth_rate * (1 - income_tax_rate), year_count)
    # monthly

    # year_count = 2
    # while calculate_wealth_without_house (year1_wealth, timeseries_datagrid.get(), service_years, monthly_income, 
    #                                       salary_growth_rate, monthly_costs_till_service, kid_support_years, scenario_1_monthly_costs_till_kids, 
    #                                       scenario_1_monthly_costs_after_kids, inflation_rate) > 0:
    #     year_count += 1

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
                        print("Added Income : " + str(wealth))
                else:
                    if containerName in expandedTimeSeriesValueData:
                        if (i in expandedTimeSeriesValueData[containerName]):
                            wealth -= 12 * float(expandedTimeSeriesValueData[containerName][i])*pow(1+float(otherData['inflationRate'])/100, i)
                            print("Reduced Costs for " + containerName + " : " + str(wealth))
        if 'existingPropertyValue' in otherData:
            if year + i == int(otherData['existingPropertySaleYear']):
                wealth += float(otherData['existingPropertyValue']) * pow(1 + float(otherData['existngPropertyAppreciation'])/100, (int(otherData['existingPropertySaleYear']) - year))
                print("Existing Property Sale: " + str(wealth))
        if 'newPropertyBudget' in otherData:
            if year + i == int(otherData['newPropertySaleYear']):
                wealth += float(otherData['newPropertyBudget']) * pow(1 + float(otherData['newPropertyAppreciation'])/100, (int(otherData['newPropertySaleYear']) - year))   
                print("New Property Sale: " + str(wealth))        
            if year + i == int(otherData['newPropertyPurchaseYear']):
                wealth -= float(otherData['newPropertyBudget']) * pow(1 + float(otherData['newPropertyAppreciation'])/100, (int(otherData['newPropertyPurchaseYear']) - year))          
                print("New Property Purchase: " + str(wealth))        
        wealth *= (1+float(expandedTimeSeriesValueData['savingsGrowthContainer'][i])/100*(1-float(otherData['incomeTax'])/100))
        print("Final Wealth : " + str(wealth))
        if wealth <= 0:
            break
    return i

# def calculate_wealth_without_house(wealth_previous_year, 
#                      year_count, service_years, monthly_income, 
#                      salary_growth_rate, monthly_costs_till_service, 
#                      kid_support_years, scenario_1_monthly_costs_till_kids, 
#                      scenario_1_monthly_costs_after_kids, inflation_rate):
    
    
#     salary_component = 0
#     if year_count <= service_years:
#         salary_component = 12 * monthly_income * math.pow(1 + salary_growth_rate, year_count)
    
#     if year_count <= service_years:
#         cost_component = monthly_costs_till_service
#     elif service_years < year_count <= kid_support_years:
#         cost_component = scenario_1_monthly_costs_till_kids
#     else:
#         cost_component = scenario_1_monthly_costs_after_kids
    
#     cost_component *= 12 * math.pow(1 + inflation_rate, year_count)
    
#     total_wealth = wealth_previous_year + salary_component - cost_component
    
#     return total_wealth


# def calculate_hra_exemption(hra_received, rent_paid, basic_salary, is_metro):

#     ten_percent_basic = 0.10 * basic_salary
#     rent_minus_ten_percent_basic = rent_paid - ten_percent_basic
#     if is_metro == "yes":
#         city_percentage_basic = 0.50 * basic_salary
#     else:
#         city_percentage_basic = 0.40 * basic_salary

#     return min(hra_received, rent_minus_ten_percent_basic, city_percentage_basic)
   
# def calculate_hra_loss(income, hraExemption):

#     hraLoss = 0.0
    
#     if income >= slab3:
#         hraLoss = min(max(income - slab3, 0), hraExemption) * 0.3 + max (slab3 + hraExemption - income, 0) * 0.2
#     elif income >= slab2:
#         hraLoss = min(max(income - slab2, 0), hraExemption) * 0.2 + max (slab2 + hraExemption - income, 0) * 0.1
#     elif income >= slab3:
#         hraLoss = min(max(income - slab3, 0), hraExemption) * 0.1
        
#     return hraLoss*(1 + cess)

# @app.route('/calc_salvage_value', methods=['POST'])
# def calc_salvage_value():
 
#     data = request.get_json()
#     houseBudget = float(data['houseBudget'])
#     houseAppreciation = float(data['houseAppreciation']) / 100
#     purchaseYear = float(data['purchaseYear'])
#     stayPeriod = float(data['stayPeriod'])
#     inflationRate = float(data['inflationRate']) / 100
#     income = float(data['income'])
#     hra = float(data['hra'])
#     rent = float(data['rent'])
#     basicIncome = float(data['basicIncome'])
#     isMetro = data['isMetro']
#     inflowPeriod = float(data['inflowPeriod'])

#     salvageValue = houseBudget * pow((1 + houseAppreciation) / (1 + inflationRate), purchaseYear + stayPeriod - date.today().year)
#     hraLoss = max (inflowPeriod - (purchaseYear - date.today().year), 0) * calculate_hra_loss (income*12, calculate_hra_exemption(hra, rent, basicIncome, isMetro)*12)

#     return jsonify({'salvageValue': round(salvageValue), 'hraLoss': round(hraLoss)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    app.run(debug=True)

