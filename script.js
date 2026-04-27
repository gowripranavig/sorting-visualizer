let array = [];
let steps = [];
let currentStep = 0;
let speed = 300;
let isPaused = false;
let isPlaying = false;

function generateArray(size = 30) {
    isPlaying = false;
    isPaused = false;
    currentStep = 0;
    
    const customInput = document.getElementById("customInput");
    if (customInput) customInput.value = "";

    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }
    renderBars();
}

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

function renderBars(activeIndex = -1, swapIndex = -1) {
    const container = document.getElementById("array");
    container.innerHTML = "";

    // Calculate dynamic width based on container size
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

// ... (Keep your existing Sorting Algorithm functions: bubbleSortSteps, etc.) ...

document.getElementById("size").addEventListener("input", (e) => {
    const sizeValue = parseInt(e.target.value);
    if (sizeValue < 10) {
        const userInput = prompt(`Enter ${sizeValue} numbers separated by commas:`);
        if (userInput) {
            document.getElementById("customInput").value = userInput;
            setCustomArray(userInput);
        } else {
            generateArray(sizeValue);
        }
    } else {
        generateArray(sizeValue);
    }
});

document.getElementById("speed").addEventListener("input", (e) => {
    speed = 1050 - e.target.value;
});

async function play() {
    isPlaying = true;
    for (let i = currentStep; i < steps.length; i++) {
        while (isPaused) await new Promise(res => setTimeout(res, 100));
        if (!isPlaying) break;

        currentStep = i;
        let step = steps[i];
        array = step.array;
        renderBars(step.active, step.swap);

        if (i === steps.length - 1) {
            document.querySelectorAll(".bar").forEach(b => b.classList.add("sorted"));
            resetControls(false);
        }
        await new Promise(res => setTimeout(res, speed));
    }
    isPlaying = false;
}

function startSort() {
    if (isPlaying) return;
    const algo = document.getElementById("algorithm").value;
    resetControls(true);

    if (algo === "bubble") bubbleSortSteps(array);
    else if (algo === "selection") selectionSortSteps(array);
    else if (algo === "insertion") insertionSortSteps(array);
    else if (algo === "quick") quickSortSteps(array);
    else if (algo === "merge") mergeSortSteps(array);
    else if (algo === "heap") heapSortSteps(array);

    showComplexity(algo.charAt(0).toUpperCase() + algo.slice(1));
    currentStep = 0;
    play();
}

function resetControls(disabled) {
    document.getElementById("startBtn").disabled = disabled;
    document.getElementById("newBtn").disabled = disabled;
    document.getElementById("algorithm").disabled = disabled;
}

// ... (Keep togglePause, showComplexity, showDescription) ...

generateArray();
