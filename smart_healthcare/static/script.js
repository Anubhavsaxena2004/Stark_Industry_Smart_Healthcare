// Update stress value display
function updateStressValue(value) {
    document.getElementById('stressValue').textContent = value;
}

// Validate form data
function validateForm(data) {
    const inputs = document.querySelectorAll('input[type="number"]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value || input.value < 0) {
            input.style.borderColor = '#ef4444';
            input.style.background = '#fef2f2';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
            input.style.background = '#f8fafc';
        }
    });
    
    return isValid;
}

// Main predict function
function predict() {
    const predictBtn = document.getElementById("predictBtn");
    const resultContainer = document.getElementById("result");
    
    const data = {
        age: document.getElementById("age").value,
        bmi: document.getElementById("bmi").value,
        glucose: document.getElementById("glucose").value,
        bp: document.getElementById("bp").value,
        stress: document.getElementById("stress").value
    };

    if (!validateForm(data)) {
        // Shake animation for invalid form
        const formContainer = document.querySelector('.form-container');
        formContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            formContainer.style.animation = '';
        }, 500);
        
        showError("Please fill out all fields with valid values.");
        return;
    }

    // Show loading state
    predictBtn.classList.add('loading');
    predictBtn.disabled = true;
    
    // Hide previous result
    resultContainer.classList.add('hidden');

    fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        displayResults(result);
    })
    .catch(err => {
        showError("Error retrieving prediction. Please try again.");
        console.error(err);
    })
    .finally(() => {
        predictBtn.classList.remove('loading');
        predictBtn.disabled = false;
    });
}

// Display results with animations
function displayResults(result) {
    const resultContainer = document.getElementById("result");
    const heartRiskPercent = document.getElementById("heartRiskPercent");
    const diabetesRiskPercent = document.getElementById("diabetesRiskPercent");
    const heartRiskBar = document.getElementById("heartRiskBar");
    const diabetesRiskBar = document.getElementById("diabetesRiskBar");
    
    // Show result container
    resultContainer.classList.remove('hidden');
    
    // Reset bars
    heartRiskBar.style.width = '0%';
    diabetesRiskBar.style.width = '0%';
    
    // Animate percentages with counting effect
    animateValue(heartRiskPercent, 0, result.heart_risk, 1000);
    animateValue(diabetesRiskPercent, 0, result.diabetes_risk, 1000);
    
    // Animate bars after a small delay
    setTimeout(() => {
        heartRiskBar.style.width = result.heart_risk + '%';
        diabetesRiskBar.style.width = result.diabetes_risk + '%';
    }, 100);
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + range * easeOut);
        
        element.textContent = current + '%';
        
        // Update color based on risk level
        if (current < 30) {
            element.style.color = '#22c55e'; // Green
        } else if (current < 60) {
            element.style.color = '#eab308'; // Yellow
        } else {
            element.style.color = '#ef4444'; // Red
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById("result");
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <div class="result-header">
            <i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i>
            <h3>Error</h3>
        </div>
        <div class="result-cards">
            <div class="result-card" style="grid-column: 1 / -1; text-align: center;">
                <p style="color: #ef4444; font-weight: 500;">${message}</p>
            </div>
        </div>
    `;
    
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// Add input event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value && this.value >= 0) {
                this.style.borderColor = '#e2e8f0';
                this.style.background = '#f8fafc';
            }
        });
        
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
