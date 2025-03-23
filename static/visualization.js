document.addEventListener('DOMContentLoaded', function () {
    const errorElement = document.getElementById('visualization-error');
    errorElement.style.display = 'block';
    errorElement.textContent = 'Loading data...';

    fetch('/get_visualization_data')
        .then(response => response.json())
        .then(data => {
            // Log the received data for debugging
            console.log("Received Data:", data);

            // Check if the data is empty
            if (!data || data.length === 0) {
                console.error('No valid data available:', data);
                errorElement.style.display = 'block';
                errorElement.textContent = 'Error: No valid data available for visualization.';
                return;
            }

            // Hide error message and create the dashboard
            errorElement.style.display = 'none';
            createDashboard(data);
        })
        .catch(error => {
            console.error('Error loading visualization data:', error);
            errorElement.textContent = 'Error loading data. Please try again later.';
        });

    // Load Chart.js library dynamically if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function () {
            console.log('Chart.js loaded successfully');
        };
        document.head.appendChild(script);
    }

    function createDashboard(data) {
        // Create all visualizations
        createAgeDistribution(data);
        createDementiaPrevalence(data);
        createRiskFactorAnalysis(data);
        createMedicationImpact(data);
        createHealthConditionsChart(data);
        createCognitiveScoreAnalysis(data);

        // Initialize scrolling animations
        initScrollAnimations();
    }

    function initScrollAnimations() {
        const sections = document.querySelectorAll('.visualization-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    function createAgeDistribution(data) {
        const ageGroups = {
            '60-69': 0,
            '70-79': 0,
            '80-89': 0,
            '90+': 0
        };

        // Count patients in each age group
        data.forEach(patient => {
            const age = parseInt(patient.Age);
            if (age >= 60 && age < 70) ageGroups['60-69']++;
            else if (age >= 70 && age < 80) ageGroups['70-79']++;
            else if (age >= 80 && age < 90) ageGroups['80-89']++;
            else if (age >= 90) ageGroups['90+']++;
        });

        // Create the chart
        const ctx = document.getElementById('age-distribution-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(ageGroups),
                datasets: [{
                    label: 'Number of Patients',
                    data: Object.values(ageGroups),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Age Distribution of Patients',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Patients'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Age Groups'
                        }
                    }
                }
            }
        });
    }

    function createDementiaPrevalence(data) {
        // Count dementia cases
        const dementiaCount = data.filter(patient => parseInt(patient.Dementia) === 1).length;
        const nonDementiaCount = data.length - dementiaCount;

        // Create the chart
        const ctx = document.getElementById('dementia-prevalence-chart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Dementia', 'No Dementia'],
                datasets: [{
                    data: [dementiaCount, nonDementiaCount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Dementia Prevalence',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    function createRiskFactorAnalysis(data) {
        // Analyze risk factors
        const riskFactors = {
            'Diabetes': 0,
            'Heart Failure': 0,
            'Renal disease': 0,
            'Depression': 0,
            'Cancer': 0,
            'Atrial fibrillation': 0
        };

        // Count patients with each risk factor who have dementia
        const dementiaPatients = data.filter(patient => parseInt(patient.Dementia) === 1);
        dementiaPatients.forEach(patient => {
            if (parseInt(patient.Diabetic) === 1) riskFactors['Diabetes']++;
            if (parseInt(patient.Heart_Failure) === 1) riskFactors['Heart Failure']++;
            if (parseInt(patient.Renal_disease) === 1) riskFactors['Renal disease']++;
            if (parseInt(patient.Depression_Status) === 1) riskFactors['Depression']++;
            if (parseInt(patient.Cancer) === 1) riskFactors['Cancer']++;
            if (parseInt(patient.Atrial_fibrillation) === 1) riskFactors['Atrial fibrillation']++;
        });

        // Create the chart
        const ctx = document.getElementById('risk-factors-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(riskFactors),
                datasets: [{
                    label: 'Number of Dementia Patients',
                    data: Object.values(riskFactors),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Risk Factors Associated with Dementia',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Patients'
                        }
                    }
                }
            }
        });
    }

    function createMedicationImpact(data) {
        // Analyze medication impact
        const medications = {
            'Antipsychotics': { withDementia: 0, withoutDementia: 0 },
            'AntiDepressants': { withDementia: 0, withoutDementia: 0 },
            'Memantine': { withDementia: 0, withoutDementia: 0 },
            'Cholinesterase_inhibitors': { withDementia: 0, withoutDementia: 0 },
            'Statins': { withDementia: 0, withoutDementia: 0 }
        };

        // Count patients with each medication, separated by dementia status
        data.forEach(patient => {
            const hasDementia = parseInt(patient.Dementia) === 1;

            if (parseInt(patient.Antipsychotics) === 1) {
                hasDementia ? medications['Antipsychotics'].withDementia++ : medications['Antipsychotics'].withoutDementia++;
            }
            if (parseInt(patient.AntiDepressants) === 1) {
                hasDementia ? medications['AntiDepressants'].withDementia++ : medications['AntiDepressants'].withoutDementia++;
            }
            if (parseInt(patient.Memantine) === 1) {
                hasDementia ? medications['Memantine'].withDementia++ : medications['Memantine'].withoutDementia++;
            }
            if (parseInt(patient['Cholinesterwase inhibitors']) === 1) {
                hasDementia ? medications['Cholinesterase_inhibitors'].withDementia++ : medications['Cholinesterase_inhibitors'].withoutDementia++;
            }
            if (parseInt(patient.Statins) === 1) {
                hasDementia ? medications['Statins'].withDementia++ : medications['Statins'].withoutDementia++;
            }
        });

        // Prepare data for chart
        const medicationLabels = Object.keys(medications);
        const withDementiaData = medicationLabels.map(med => medications[med].withDementia);
        const withoutDementiaData = medicationLabels.map(med => medications[med].withoutDementia);

        // Create the chart
        const ctx = document.getElementById('medication-impact-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: medicationLabels,
                datasets: [
                    {
                        label: 'With Dementia',
                        data: withDementiaData,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Without Dementia',
                        data: withoutDementiaData,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Medication Usage by Dementia Status',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Patients'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Medications'
                        }
                    }
                }
            }
        });
    }

    function createHealthConditionsChart(data) {
        // Count chronic health conditions
        const conditions = {
            'Diabetes': 0,
            'Heart Disease': 0,
            'Hypertension': 0,
            'None': 0
        };

        data.forEach(patient => {
            const condition = patient.Chronic_Health_Conditions;
            if (conditions.hasOwnProperty(condition)) {
                conditions[condition]++;
            }
        });

        // Create the chart
        const ctx = document.getElementById('health-conditions-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(conditions),
                datasets: [{
                    data: Object.values(conditions),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribution of Chronic Health Conditions',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    function createCognitiveScoreAnalysis(data) {
        // Group MMSE scores
        const mmseGroups = {
            'Severe (0-9)': 0,
            'Moderate (10-18)': 0,
            'Mild (19-23)': 0,
            'Normal (24-30)': 0
        };

        // Count patients in each MMSE group
        data.forEach(patient => {
            const mmse = parseFloat(patient.MMSE);
            if (mmse >= 0 && mmse <= 9) mmseGroups['Severe (0-9)']++;
            else if (mmse > 9 && mmse <= 18) mmseGroups['Moderate (10-18)']++;
            else if (mmse > 18 && mmse <= 23) mmseGroups['Mild (19-23)']++;
            else if (mmse > 23 && mmse <= 30) mmseGroups['Normal (24-30)']++;
        });

        // Create the chart
        const ctx = document.getElementById('cognitive-score-chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(mmseGroups),
                datasets: [{
                    label: 'Number of Patients',
                    data: Object.values(mmseGroups),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cognitive Score Distribution (MMSE)',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Patients'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'MMSE Score Groups'
                        }
                    }
                }
            }
        });
    }

    function initScrollAnimations() {
        // Get all visualization sections
        const sections = document.querySelectorAll('.visualization-section');

        // Create an intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add 'visible' class when section is in viewport
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2 // Trigger when 20% of the element is visible
        });

        // Observe each section
        sections.forEach(section => {
            observer.observe(section);
        });
    }
});