const EXISTING_PROPERTY_PLANS = 'existing_property_plans';
const NEW_PROPERTY_PLANS = 'new_property_plans';
const TAX_RELATED_ENQUIRY = 'tax_related_enquiry';
const EXISTING_PROP_INPUT_CONTAINER = 'existingPropInputContainer';
const EXISTING_PROPERTY_VALUE = 'existingPropertyValue';
const EXISTING_PROPERTY_APPRECIATION = 'existngPropertyAppreciation';
const EXISTING_PROPERTY_SALE_YEAR = 'existingPropertySaleYear';
const NEW_PROP_INPUT_CONTAINER = 'newPropInputContainer';
const NEW_PROPERTY_BUDGET = 'newPropertyBudget';
const NEW_PROPERTY_APPRECIATION = 'newPropertyAppreciation';
const NEW_PROP_PURCHASE_YEAR = 'newPropertyPurchaseYear';
const NEW_PROP_SALE_YEAR = 'newPropertySaleYear';

document.getElementById('hasProperty').addEventListener('click', function (e) {
    if (document.getElementById(EXISTING_PROP_INPUT_CONTAINER) != null)
        return;

    existingPropContainer = document.getElementById(EXISTING_PROPERTY_PLANS);

    inputContainer = document.createElement('div');
    inputContainer.setAttribute('id', EXISTING_PROP_INPUT_CONTAINER);
    inputContainer.className = 'input-row';

    propValue = document.createElement('input');
    propValue.type = 'float';
    propValue.id = EXISTING_PROPERTY_VALUE;
    propValue.name = 'Existing Property Value';
    propValue.placeholder = "Property Value";
    propValue.required = true;

    propGrowth = document.createElement('input');
    propGrowth.type = 'float';
    propGrowth.id = EXISTING_PROPERTY_APPRECIATION;
    propGrowth.name = 'Existing Property Appreciation';
    propGrowth.placeholder = "Expected Annual Appreciation (%)";
    propGrowth.required = true;

    salYear = document.createElement('input');
    salYear.type = 'number';
    salYear.id = EXISTING_PROPERTY_SALE_YEAR;
    salYear.name = 'Existing Property Sale Year';
    salYear.placeholder = "Expected Year of Sale";
    salYear.required = true;

    inputContainer.appendChild(propValue);
    inputContainer.appendChild(propGrowth);
    inputContainer.appendChild(salYear);
    existingPropContainer.appendChild(inputContainer);

    if (document.getElementById(TAX_RELATED_ENQUIRY) == null)
        addTaxEnquirySection();
});

document.getElementById('willPurchase').addEventListener('click', function (e) {
    if (document.getElementById(NEW_PROP_INPUT_CONTAINER) != null)
        return;

    newPropContainer = document.getElementById(NEW_PROPERTY_PLANS);

    inputContainer = document.createElement('div');
    inputContainer.setAttribute('id', NEW_PROP_INPUT_CONTAINER);
    inputContainer.className = 'input-row';

    propValue = document.createElement('input');
    propValue.type = 'float';
    propValue.id = NEW_PROPERTY_BUDGET;
    propValue.name = 'New Property Budget';
    propValue.placeholder = "Budgeted Spend as of Today";
    propValue.required = true;

    propGrowth = document.createElement('input');
    propGrowth.type = 'float';
    propGrowth.id = NEW_PROPERTY_APPRECIATION;
    propGrowth.name = 'New Property Appreciation';
    propGrowth.placeholder = "Expected Annual Appreciation (%)";
    propGrowth.required = true;

    purYear = document.createElement('input');
    purYear.type = 'number';
    purYear.id = NEW_PROP_PURCHASE_YEAR;
    purYear.name = 'New Property Purchase Year';
    purYear.placeholder = "Expected Year of Purchase";
    purYear.required = true;

    salYear = document.createElement('input');
    salYear.type = 'number';
    salYear.id = NEW_PROP_SALE_YEAR;
    salYear.name = 'New Property Sale Year';
    salYear.placeholder = "Expected Year of Sale";
    salYear.required = true;

    inputContainer.appendChild(propValue);
    inputContainer.appendChild(purYear);
    inputContainer.appendChild(salYear);
    inputContainer.appendChild(propGrowth);
    newPropContainer.appendChild(inputContainer);

    if (document.getElementById(TAX_RELATED_ENQUIRY) == null)
        addTaxEnquirySection();
});

document.getElementById('noProperty').addEventListener('click', function (e) {
    document.getElementById(EXISTING_PROPERTY_PLANS).innerHTML = '';
    if (document.getElementById('wontPurchase').checked)
        document.getElementById(TAX_RELATED_ENQUIRY).remove();
});

document.getElementById('wontPurchase').addEventListener('click', function (e) {
    document.getElementById(NEW_PROPERTY_PLANS).innerHTML = '';
    if (document.getElementById('noProperty').checked)
        document.getElementById(TAX_RELATED_ENQUIRY).remove();
});

const TAX_SECTION_LABEL = 'tax_section_label';
const ISMETRO_QUESTION = 'isMetro_question';
const HRA_LABEL = 'hra_label';
const BASIC_LABEL = 'basic_label';
function addTaxEnquirySection() {
    // Create the main container div
    taxRelatedEnquiry = document.createElement('div');
    taxRelatedEnquiry.id = TAX_RELATED_ENQUIRY;
    // Create and append the tax section label
    taxSectionLabel = document.createElement('label');
    taxSectionLabel.id = TAX_SECTION_LABEL;
    taxRelatedEnquiry.appendChild(taxSectionLabel);

    // Create and append the isMetro question label
    const isMetroQuestion = document.createElement('label');
    isMetroQuestion.className = 'label-subtext';
    isMetroQuestion.htmlFor = 'isMetro';
    isMetroQuestion.id = ISMETRO_QUESTION;
    taxRelatedEnquiry.appendChild(isMetroQuestion);

    document.getElementById('property_section').appendChild(taxRelatedEnquiry);
    // Create and append the radio options container
    const radioOptionsContainer = document.createElement('div');
    radioOptionsContainer.className = 'radio-options';

    // Create and append the Yes radio option
    const yesDiv = document.createElement('div');
    const yesLabel = document.createElement('label');
    yesLabel.className = 'label-subtext';
    yesLabel.htmlFor = 'isMetroYes';
    yesLabel.textContent = 'Yes';
    yesDiv.appendChild(yesLabel);

    const yesInput = document.createElement('input');
    yesInput.type = 'radio';
    yesInput.id = 'isMetroYes';
    yesInput.name = 'isMetro';
    yesInput.value = 'yes';
    yesInput.checked = true;
    yesDiv.appendChild(yesInput);

    radioOptionsContainer.appendChild(yesDiv);

    // Create and append the No radio option
    const noDiv = document.createElement('div');
    const noLabel = document.createElement('label');
    noLabel.className = 'label-subtext';
    noLabel.htmlFor = 'isMetroNo';
    noLabel.style.display = 'inline';
    noLabel.textContent = 'No';
    noDiv.appendChild(noLabel);

    const noInput = document.createElement('input');
    noInput.type = 'radio';
    noInput.id = 'isMetroNo';
    noInput.name = 'isMetro';
    noInput.value = 'no';
    noDiv.appendChild(noInput);

    radioOptionsContainer.appendChild(noDiv);

    // Append the radio options container to the main container
    taxRelatedEnquiry.appendChild(radioOptionsContainer);

    // Create and append the HRA label
    const hraLabel = document.createElement('label');
    hraLabel.className = 'label-subtext';
    hraLabel.htmlFor = 'hra';
    hraLabel.id = HRA_LABEL;
    taxRelatedEnquiry.appendChild(hraLabel);

    // Create and append the HRA income container
    const hraIncomeContainer = document.createElement('div');
    hraIncomeContainer.id = 'hraIncomeContainer';
    taxRelatedEnquiry.appendChild(hraIncomeContainer);

    // Create and append the Basic label
    const basicLabel = document.createElement('label');
    basicLabel.className = 'label-subtext';
    basicLabel.htmlFor = 'basic';
    basicLabel.id = BASIC_LABEL;
    taxRelatedEnquiry.appendChild(basicLabel);

    // Create and append the Basic income container
    const basicIncomeContainer = document.createElement('div');
    basicIncomeContainer.id = 'basicIncomeContainer';
    taxRelatedEnquiry.appendChild(basicIncomeContainer);

    document.querySelector('#' + TAX_SECTION_LABEL).innerText = constants.tax_section;
    document.querySelector('#' + ISMETRO_QUESTION).innerText = constants.isMetro;
    document.querySelector('#' + HRA_LABEL).innerText = constants.hra;
    document.querySelector('#' + BASIC_LABEL).innerText = constants.basic;

    addFirstRow(basicIncomeContainer.id);
    addFirstRow(hraIncomeContainer.id);

    document.getElementById('property_section').appendChild(taxRelatedEnquiry);

    // Append the main container to the body or a specific parent element
}