document.addEventListener('DOMContentLoaded', function () {
    loadConstants();    
});

async function loadConstants() {
    response = await fetch('/static/stringLabels.json');
    constants = await response.json();

    document.querySelector('#homepage_title').innerText = constants.homepage;

    document.querySelector('#asset_section_title').innerText = constants.asset_section;
    document.querySelector('#total_current_assets_label').innerText = constants.total_current_assets;  
    document.querySelector('#total_current_assets_subtext').innerText = constants.total_current_assets_subtext;  
    document.querySelector('#wealth_growth_label').innerText = constants.wealth_growth;
    document.querySelector('#current_monthly_inflow_label').innerText = constants.current_monthly_inflow;
    document.querySelector('#current_monthly_inflow_subtext').innerText = constants.current_monthly_inflow_subtext;

    document.querySelector('#monthly_expenses_section_title').innerText = constants.monthly_expenses_section;
    document.querySelector('#rent_label').innerText = constants.rent;
    document.querySelector('#utility_label').innerText = constants.utility;
    document.querySelector('#utility_subtext').innerText = constants.utility_subtext;
    document.querySelector('#maids_label').innerText = constants.maids;
    document.querySelector('#home_essentials_label').innerText = constants.home_essentials;
    document.querySelector('#home_essentials_subtext').innerText = constants.home_essentials_subtext;
    document.querySelector('#car_expenses_label').innerText = constants.car_expenses;
    document.querySelector('#car_expenses_subtext').innerText = constants.car_expenses_subtext;
    document.querySelector('#car_replacement_label').innerText = constants.car_replacement;
    document.querySelector('#car_replacement_subtext').innerText = constants.car_replacement_subtext;
    document.querySelector('#leisure_label').innerText = constants.leisure;
    document.querySelector('#leisure_subtext').innerText = constants.leisure_subtext;
    document.querySelector('#assets_repair_replacement_label').innerText = constants.assets_repair_replacement;
    document.querySelector('#assets_repair_replacement_subtext').innerText = constants.assets_repair_replacement_subtext;
    document.querySelector('#domestic_travel_label').innerText = constants.domestic_travel;
    document.querySelector('#international_travel_label').innerText = constants.international_travel;
    document.querySelector('#domestic_travel_subtext').innerText = constants.domestic_travel_subtext;
    document.querySelector('#international_travel_subtext').innerText = constants.international_travel_subtext;
    document.querySelector('#medical_expenses_label').innerText = constants.medical_expenses;
    document.querySelector('#children_count_label').innerText = constants.children_count;

    document.querySelector('#property_investment_section_title').innerText = constants.property_investment_section;
    document.querySelector('#existing_property_question').innerText = constants.existing_property;
    document.querySelector('#new_property_purchase_question').innerText = constants.new_property_purchase;
    
    document.querySelector('#global_settings_section_label').innerText = constants.global_settings_section;
    document.querySelector('#inflation_rate_label').innerText = constants.inflation_rate;
    document.querySelector('#income_tax_rate_label').innerText = constants.income_tax_rate;
}