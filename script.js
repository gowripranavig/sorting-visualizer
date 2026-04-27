let array = [];
let steps = [];
let currentStep = 0;
let speed = 300;
let isPaused = false;
let isPlaying = false;

// Main generation logic that checks for the size threshold
function generateArray(sizeInput = null) {
    isPlaying = false;
    isPaused = false;
    currentStep = 0;
    
    let size = sizeInput || parseInt(document.getElementById("size").value);

    // If size is under 20, force the user to enter specific numbers
    if (size < 20) {
        const userInput = prompt(`Size is ${size}. Please enter ${size} numbers separated by commas:`);
        if (userInput) {
            document.getElementById("customInput").value = userInput;
            setCustomArray(userInput);
            return; // Exit to avoid random generation
        }
    }

    // Default random generation for size >= 20
    const customInput = document.getElementById("customInput");
    if (customInput) customInput.value = "";

    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }
    
    renderBars();
}

// Processes manual input strings into the actual array
function setCustomArray(manualData = null) {
    isPlaying = false;
    isPaused = false;

    const input = manualData || document.getElementById("customInput").value;
    if (!input) return;

    const customArray = input.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num) && num > 0);

    if (customArray.length === 0) return;

    array = customArray;
    currentStep = 0;
    steps = [];
    renderBars();
}

// Renders bars with dynamic widths so small arrays fill the container
function renderBars(activeIndex = -1, swapIndex = -1) {
    const container = document.getElementById("array");
    container.innerHTML = "";

    const containerWidth = container.clientWidth || 800;
    const barWidth = Math.max(15, Math.floor((containerWidth / array.length) - 4));

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        bar.style.width = `${barWidth}px`;

        const label = document.createElement("span");
        label.classList.add("bar-label");
        label.innerText = value;

        if (index === activeIndex) bar.classList.add("active");
        if (index === swapIndex) bar.classList.add("swap");

        bar.appendChild(label);
        container.appendChild(bar);
    });
}

// --- Sorting Algorithm (Example: Bubble Sort) ---
function bubbleSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp.length - i - 1; j++) {
            steps.push({ array: [...temp], active: j, swap: j + 1 });
            if (temp[j] > temp[j + 1]) {
                [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
                steps.push({ array: [...temp], active: j, swap: j + 1 });
            }
        }
    }
}

// --- Control Logic ---
async function play() {
    isPlaying = true;
    for (let i = currentStep; i < steps.length; i++) {
        while (isPaused) await new Promise(res => setTimeout(res, 100));
        if (!isPlaying) break;

        currentStep = i;
        let step = steps[i];
        array = step.array;
        renderBars(step.active, step.swap);
        await new Promise(res => setTimeout(res, speed));
    }
    isPlaying = false;
}

function startSort() {
    if (isPlaying) return;
    let algo = document.getElementById("algorithm").value;
    if (algo === "bubble") bubbleSortSteps(array);
    // Add other sorting algorithm calls here
    play();
}

// Event Listeners
document.getElementById("size").addEventListener("input", (e) => {
    generateArray(parseInt(e.target.value));
});

document.getElementById("speed").addEventListener("input", (e) => {
    speed = 1050 - e.target.value;
});

// Initial Load
generateArray();
