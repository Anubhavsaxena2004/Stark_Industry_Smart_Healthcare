function predict() {
    const data = {
        age: document.getElementById("age").value,
        bmi: document.getElementById("bmi").value,
        glucose: document.getElementById("glucose").value,
        bp: document.getElementById("bp").value,
        stress: document.getElementById("stress").value
    };

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
    });
}
