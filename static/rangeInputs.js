function addFirstRow(containerName) {
    mainContainer = document.getElementById(containerName);
    inputContainer = getInputContainer(mainContainer);

    // Create the add button
    addButton = document.createElement("button");
    addButton.className = "add-button-design";
    addButton.innerHTML = "Add";

    addButton.onclick = function (event) {
        event.preventDefault();
        addAdditionalRow(containerName);
    };

    // Append the container to the desired parent element in the DOM
    inputContainer.appendChild(addButton);
    mainContainer.appendChild(inputContainer);
}

function addAdditionalRow(containerName) {
    mainContainer = document.getElementById(containerName);
    inputContainer = getInputContainer(mainContainer);

    // Create the remove button
    removeButton = document.createElement("button");
    removeButton.className = "remove-button-design";
    removeButton.innerHTML = "Remove";

    removeButton.onclick = function (event) {
        event.preventDefault();
        this.parentElement.remove();
    };

    // Append the container to the desired parent element in the DOM  
    inputContainer.appendChild(removeButton);
    mainContainer.appendChild(inputContainer);
}

document.getElementById("childrenCount").addEventListener("input", function (e) {
    numChildren = document.getElementById("childrenCount").value;
    container = document.getElementById("child-forms-container");
    container.innerHTML = "";  // Clear previous forms

    for (let i = 0; i < numChildren; i++) {
        // childForm = document.createElement("div");

        childNumber = document.createElement("label");
        childNumber.innerText = `Child ${i + 1}`;

        inputFields = getInputContainer(container);
        inputFields.setAttribute("id", "childFormContainer");

        container.appendChild(childNumber);
        container.appendChild(inputFields);
    }
});

function getInputContainer(mainContainer) {
    currentYear = new Date().getFullYear();
    containerName = mainContainer.id;
    counter = mainContainer.childElementCount;

    // Create a container for the input elements
    inputContainer = document.createElement("div");
    inputContainer.className = "input-row";
    // inputContainer.id = containerName + "_" + "inputRow" + "_" + counter + 1;



    // Create the start year input
    startYearInput = document.createElement("input");
    startYearInput.type = "number";
    startYearInput.id = "startYear";
    startYearInput.name = "Start Year";
    startYearInput.value = currentYear;

    // if (counter > 0) {
    //     lastInputContainer = mainContainer.querySelector("#" + containerName + "_" + "inputContainer" + "_" + counter);
    //     console.log("#" + containerName + "_" + "inputRow" + "_" + counter);
    //     startYearInput.value = lastInputContainer.querySelector("#startYear").value;
    // }
    startYearInput.required = true;

    // Create the end year input
    endYearInput = document.createElement("input");
    endYearInput.type = "number";
    endYearInput.id = "endYear";
    endYearInput.name = "End Year";
    endYearInput.value = currentYear + 100;
    endYearInput.required = true;

    // Create the value input
    valueInput = document.createElement("input");
    valueInput.type = "float";
    valueInput.id = "value";
    valueInput.name = "Value";
    valueInput.value = 1000; //"Annual Value";
    valueInput.required = true;
    valueInput.oninput = function (event) {
        event.preventDefault();
        formatNumber(this);
    };

    // Create the growth rate input
    growthRateInput = document.createElement("input");
    growthRateInput.type = "float";
    growthRateInput.id = "growthRate";
    growthRateInput.name = "Growth Rate";
    growthRateInput.value = 0;//"Annual Growth Rate (%)";
    growthRateInput.required = true;

    // Append the input elements and button to the container
    inputContainer.appendChild(startYearInput);
    inputContainer.appendChild(endYearInput);
    inputContainer.appendChild(valueInput);
    inputContainer.appendChild(growthRateInput);

    return inputContainer;
}

function formatNumber(input) {
    // Remove non-numeric characters from input value
    let value = input.value.replace(/\D/g, '');

    // Add commas for thousands separator
    value = Number(value).toLocaleString();

    // Update the input field value with formatted number
    input.value = value;
}
