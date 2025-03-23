from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
import pandas as pd
import os



app = Flask(__name__)

# Load trained model
model = pickle.load(open("model.pkl", "rb"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/visualization")
def visualization():
    return render_template("visualization.html")

@app.route("/get_visualization_data")
def get_visualization_data():
    try:
        # Load the CSV data
        csv_path = os.path.join(os.path.dirname(__file__), 'finalDementia.csv')
        df = pd.read_csv(csv_path)

        # Replace NaN values with None for JSON serialization
        df = df.where(pd.notnull(df), None)

        # Convert DataFrame to list of dictionaries for JSON serialization
        data = df.to_dict('records')

        # Log problematic records for debugging
        invalid_records = [record for record in data if any(value is None for value in record.values())]
        print(f"Number of invalid records: {len(invalid_records)}")
        if invalid_records:
            print("Sample invalid record:", invalid_records[0])

        return jsonify(data)
    except Exception as e:
        # Log the error for debugging
        print("Error in /get_visualization_data:", str(e))
        return jsonify({"error": str(e)})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json  # Receive JSON data from frontend

        # Extract and convert input values - now with Dementia attribute included
        input_features = np.array([[
            float(data["Diabetic"]), float(data["AlcoholLevel"]), float(data["Weight"]), float(data["Age"]), int(data["Gender"]),
            int(data["Depression_Status"]), int(data["Medication_History"]), int(data["Chronic_Health_Conditions"]),
            int(data["Total_medications"]), int(data["CCI"]), int(data["Cancer"]), int(data["Atrial_fibrillation"]),
            int(data["Renal_disease"]), int(data["Heart_Failure"]), float(data["MMSE"]), float(data["Height"]), float(data["BMI"]),
            int(data["Anemia"]), int(data["Acute_Kidney_injury"]), int(data["Antipsychotics"]), int(data["AntiDepressants"]),
            int(data["Memantine"]), int(data["Cholinesterwase_inhibitors"]), int(data["Statins"]), int(data["Diuretics"]),
            int(data["Calcium_Channel_blockers"]), int(data["Liver_failure"]), int(data["Dementia"])
        ]])

        # Predict using model
        prediction = model.predict(input_features)[0]
        return jsonify({"prediction": int(prediction)})

    except Exception as e:
        return jsonify({"error": str(e)})
    

if __name__ == "__main__":
    app.run(debug=True)
