from flask import Flask, render_template, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load trained models
heart_model = pickle.load(open('model_heart.pkl', 'rb'))
diabetes_model = pickle.load(open('model_diabetes.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    age = float(data['age'])
    bmi = float(data['bmi'])
    glucose = float(data['glucose'])
    bp = float(data['bp'])
    stress = float(data['stress'])

    input_data = np.array([[age, bmi, glucose, bp]])
    input_scaled = scaler.transform(input_data)

    heart_risk = heart_model.predict_proba(input_scaled)[0][1] * 100
    diabetes_risk = diabetes_model.predict_proba(input_scaled)[0][1] * 100

    # Stress adjusted heart risk
    adjusted_heart = heart_risk + (0.2 * stress)

    return jsonify({
        "heart_risk": round(adjusted_heart, 2),
        "diabetes_risk": round(diabetes_risk, 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
