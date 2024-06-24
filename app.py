from flask import Flask, render_template, request, jsonify
from datetime import date 
import os

app = Flask(__name__)

slab1 = 250000
slab2 = 500000
slab3 = 1000000
cess = 0.04

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calc_years', methods=['POST'])
def calc_years():
    data = request.get_json()
    expenses = data['expenses']
    savings = data['savings']
    years = round(float(savings) / (float(expenses) * 12))
    return jsonify({'years': years})

def calculate_hra_exemption(hra_received, rent_paid, basic_salary, is_metro):

    ten_percent_basic = 0.10 * basic_salary
    rent_minus_ten_percent_basic = rent_paid - ten_percent_basic
    if is_metro == "yes":
        city_percentage_basic = 0.50 * basic_salary
    else:
        city_percentage_basic = 0.40 * basic_salary

    return min(hra_received, rent_minus_ten_percent_basic, city_percentage_basic)
   
def calculate_hra_loss(income, hraExemption):

    hraLoss = 0.0
    
    if income >= slab3:
        hraLoss = min(max(income - slab3, 0), hraExemption) * 0.3 + max (slab3 + hraExemption - income, 0) * 0.2
    elif income >= slab2:
        hraLoss = min(max(income - slab2, 0), hraExemption) * 0.2 + max (slab2 + hraExemption - income, 0) * 0.1
    elif income >= slab3:
        hraLoss = min(max(income - slab3, 0), hraExemption) * 0.1
        
    return hraLoss*(1 + cess)

@app.route('/calc_salvage_value', methods=['POST'])
def calc_salvage_value():
 
    data = request.get_json()
    houseBudget = float(data['houseBudget'])
    houseAppreciation = float(data['houseAppreciation']) / 100
    purchaseYear = float(data['purchaseYear'])
    stayPeriod = float(data['stayPeriod'])
    inflationRate = float(data['inflationRate']) / 100
    income = float(data['income'])
    hra = float(data['hra'])
    rent = float(data['rent'])
    basicIncome = float(data['basicIncome'])
    isMetro = data['isMetro']
    inflowPeriod = float(data['inflowPeriod'])

    salvageValue = houseBudget * pow((1 + houseAppreciation) / (1 + inflationRate), purchaseYear + stayPeriod - date.today().year)
    hraLoss = max (inflowPeriod - (purchaseYear - date.today().year), 0) * calculate_hra_loss (income*12, calculate_hra_exemption(hra, rent, basicIncome, isMetro)*12)

    return jsonify({'salvageValue': round(salvageValue), 'hraLoss': round(hraLoss)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    app.run(debug=True)

