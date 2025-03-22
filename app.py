from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model
model = pickle.load(open("model.pkl", "rb"))

@app.route("/")
def home():
    return render_template("index.html")

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