function validateForm(data) {
    return data.age && data.bmi && data.glucose && data.bp && data.stress !== undefined;
}

function predict() {
    const predictBtn = document.getElementById("predictBtn");
    const data = {
        age: document.getElementById("age").value,
        bmi: document.getElementById("bmi").value,
        glucose: document.getElementById("glucose").value,
        bp: document.getElementById("bp").value,
        stress: document.getElementById("stress").value
    };

    if (!validateForm(data)) {
        alert("Please fill out all fields before submitting.");
        return;
    }

    predictBtn.disabled = true;
    predictBtn.textContent = "Calculating...";

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        document.getElementById("result").innerHTML = 
            `Heart Risk: ${result.heart_risk}% <br>
             Diabetes Risk: ${result.diabetes_risk}%`;
    })
    .catch(err => {
        document.getElementById("result").textContent = "Error retrieving prediction.";
        console.error(err);
    })
    .finally(() => {
        predictBtn.disabled = false;
        predictBtn.textContent = "Predict Risk";
    });
}
