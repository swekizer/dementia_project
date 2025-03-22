document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("predictionForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Show the result div
        document.getElementById("result").style.display = "block";
        document.getElementById("result").innerText = "Processing your assessment...";

        // Get values from form elements - properly handling dropdowns vs checkboxes
        function getSelectValue(id) {
            const element = document.getElementById(id);
            return element.value === "" ? "0" : element.value;
        }

        function getCheckboxValue(id) {
            return document.getElementById(id).checked ? 1 : 0;
        }

        function getNumericValue(id) {
            let value = document.getElementById(id).value;
            return value === "" ? 0 : parseFloat(value);
        }

        let formData = {
            Diabetic: getSelectValue("Diabetic"),
            AlcoholLevel: getNumericValue("AlcoholLevel"),
            Weight: getNumericValue("Weight"),
            Age: getNumericValue("Age"),
            Gender: getSelectValue("Gender"),
            Depression_Status: getSelectValue("Depression_Status"),
            Medication_History: getSelectValue("Medication_History"),
            Chronic_Health_Conditions: getNumericValue("Chronic_Health_Conditions"),
            Total_medications: getNumericValue("Total_medications"),
            CCI: getNumericValue("CCI"),
            Cancer: getSelectValue("Cancer"),
            Atrial_fibrillation: getSelectValue("Atrial_fibrillation"),
            Renal_disease: getSelectValue("Renal_disease"),
            Heart_Failure: getSelectValue("Heart_Failure"),
            MMSE: getNumericValue("MMSE"),
            Height: getNumericValue("Height"),
            BMI: getNumericValue("BMI"),
            Anemia: getSelectValue("Anemia"),
            Acute_Kidney_injury: getSelectValue("Acute_Kidney_injury"),
            Antipsychotics: getCheckboxValue("Antipsychotics"),
            AntiDepressants: getCheckboxValue("AntiDepressants"),
            Memantine: getCheckboxValue("Memantine"),
            Cholinesterwase_inhibitors: getCheckboxValue("Cholinesterwase_inhibitors"),
            Statins: getCheckboxValue("Statins"),
            Diuretics: getCheckboxValue("Diuretics"),
            Calcium_Channel_blockers: getCheckboxValue("Calcium_Channel_blockers"),
            Liver_failure: getSelectValue("Liver_failure"),
            Dementia: getSelectValue("Dementia")
        };

        console.log("Sending data:", formData);

        fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    document.getElementById("result").innerText = "Error: " + data.error;
                } else {
                    const resultElement = document.getElementById("result");
                    if (data.prediction === 1) {
                        resultElement.innerText = "Assessment Result: Higher mortality risk detected based on your health profile. We strongly recommend discussing these results with your healthcare provider as soon as possible.";
                        resultElement.style.backgroundColor = "#fff5f5";
                        resultElement.style.borderLeft = "4px solid #fc8181";
                    } else {
                        resultElement.innerText = "Assessment Result: Lower mortality risk detected based on your health profile. Continue with regular health check-ups and maintaining a healthy lifestyle.";
                        resultElement.style.backgroundColor = "#f0fff4";
                        resultElement.style.borderLeft = "4px solid #68d391";
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("result").innerText = "Error processing your assessment. Please try again.";
            });
    });

    // Add BMI auto-calculation
    const heightInput = document.getElementById('Height');
    const weightInput = document.getElementById('Weight');
    const bmiInput = document.getElementById('BMI');

    function calculateBMI() {
        const height = heightInput.value;
        const weight = weightInput.value;

        if (height && weight) {
            // Convert height to meters and calculate BMI
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            bmiInput.value = bmi.toFixed(1);
        }
    }

    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
});
