let array = [];
let steps = [];
let currentStep = 0;
let speed = 300;
let isPaused = false;
let isPlaying = false;

function generateArray(size = 30) {
    isPaused = false;
    isPlaying = false;
    currentStep = 0;
    
    // Clear the custom input field when generating a random array
    const customInput = document.getElementById("customInput");
    if (customInput) customInput.value = "";

    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 300) + 20);
    }
    document.querySelectorAll(".bar").forEach(bar => {
        bar.classList.remove("sorted");
    });
    renderBars();
}

/**
 * Handles manual array input from the user
 */
function setCustomArray() {
    const input = document.getElementById("customInput").value;
    
    // Convert string to array of numbers, filtering out non-numbers
    const customArray = input.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num) && num > 0);

    if (customArray.length === 0) {
        alert("Please enter valid numbers separated by commas (e.g., 50, 20, 100).");
        return;
    }

    if (customArray.length > 20) {
        alert("Please limit manual input to 20 numbers for the best visualization.");
        return;
    }

    // Reset state
    isPaused = false;
    isPlaying = false;
    currentStep = 0;
    steps = [];
    array = customArray;

    // Reset UI styling
    document.querySelectorAll(".bar").forEach(bar => bar.classList.remove("sorted"));
    
    renderBars();
}

function renderBars(activeIndex = -1, swapIndex = -1) {
    const container = document.getElementById("array");
    container.innerHTML = "";

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        // Height is value + constant to ensure very small numbers are visible
        bar.style.height = value + "px";

        const label = document.createElement("span");
        label.classList.add("bar-label");
        label.innerText = value;

        if (index === activeIndex) bar.classList.add("active");
        if (index === swapIndex) bar.classList.add("swap");

        bar.appendChild(label);
        container.appendChild(bar);
    });
}

// --- Sorting Algorithms ---

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

function selectionSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    for (let i = 0; i < temp.length; i++) {
        let min = i;
        for (let j = i + 1; j < temp.length; j++) {
            steps.push({ array: [...temp], active: j, swap: min });
            if (temp[j] < temp[min]) min = j;
        }
        [temp[i], temp[min]] = [temp[min], temp[i]];
        steps.push({ array: [...temp], active: i, swap: min });
    }
}

function insertionSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    for (let i = 1; i < temp.length; i++) {
        let key = temp[i];
        let j = i - 1;
        while (j >= 0 && temp[j] > key) {
            steps.push({ array: [...temp], active: j, swap: j + 1 });
            temp[j + 1] = temp[j];
            j--;
        }
        temp[j + 1] = key;
        steps.push({ array: [...temp], active: j + 1, swap: i });
    }
}

function quickSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    function quickSort(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            quickSort(low, pi - 1);
            quickSort(pi + 1, high);
        }
    }
    function partition(low, high) {
        let pivot = temp[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            steps.push({ array: [...temp], active: j, swap: high });
            if (temp[j] < pivot) {
                i++;
                [temp[i], temp[j]] = [temp[j], temp[i]];
                steps.push({ array: [...temp], active: i, swap: j });
            }
        }
        [temp[i + 1], temp[high]] = [temp[high], temp[i + 1]];
        steps.push({ array: [...temp], active: i + 1, swap: high });
        return i + 1;
    }
    quickSort(0, temp.length - 1);
}

function mergeSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    function mergeSort(l, r) {
        if (l >= r) return;
        let m = Math.floor((l + r) / 2);
        mergeSort(l, m);
        mergeSort(m + 1, r);
        merge(l, m, r);
    }
    function merge(l, m, r) {
        let left = temp.slice(l, m + 1);
        let right = temp.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) { temp[k] = left[i]; i++; }
            else { temp[k] = right[j]; j++; }
            steps.push({ array: [...temp], active: k, swap: -1 });
            k++;
        }
        while (i < left.length) {
            temp[k] = left[i]; i++;
            steps.push({ array: [...temp], active: k, swap: -1 });
            k++;
        }
        while (j < right.length) {
            temp[k] = right[j]; j++;
            steps.push({ array: [...temp], active: k, swap: -1 });
            k++;
        }
    }
    mergeSort(0, temp.length - 1);
}

function heapSortSteps(arr) {
    let temp = [...arr];
    steps = [];
    function heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        if (left < n && temp[left] > temp[largest]) largest = left;
        if (right < n && temp[right] > temp[largest]) largest = right;
        if (largest !== i) {
            [temp[i], temp[largest]] = [temp[largest], temp[i]];
            steps.push({ array: [...temp], active: i, swap: largest });
            heapify(n, largest);
        }
    }
    let n = temp.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
        [temp[0], temp[i]] = [temp[i], temp[0]];
        steps.push({ array: [...temp], active: 0, swap: i });
        heapify(i, 0);
    }
}

// --- Control Logic ---

function startSort() {
    document.getElementById("startBtn").disabled = true;
    document.getElementById("newBtn").disabled = true;
    document.getElementById("algorithm").disabled = true;
    let algo = document.getElementById("algorithm").value;
    
    if (isPlaying) return;

    if (algo === "bubble") bubbleSortSteps(array);
    else if (algo === "selection") selectionSortSteps(array);
    else if (algo === "insertion") insertionSortSteps(array);
    else if (algo === "quick") quickSortSteps(array);
    else if (algo === "merge") mergeSortSteps(array);
    else if (algo === "heap") heapSortSteps(array);

    showComplexity(algo.charAt(0).toUpperCase() + algo.slice(1));
    showDescription(algo.charAt(0).toUpperCase() + algo.slice(1));

    currentStep = 0;
    isPaused = false;
    play();
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        let step = steps[currentStep];
        array = step.array;
        renderBars(step.active, step.swap);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        let step = steps[currentStep];
        array = step.array;
        renderBars(step.active, step.swap);
    }
}

document.getElementById("speed").addEventListener("input", (e) => {
    speed = 1050 - e.target.value;
});

document.getElementById("size").addEventListener("input", (e) => {
    generateArray(e.target.value);
});

async function play() {
    isPlaying = true;
    for (let i = currentStep; i < steps.length; i++) {
        while (isPaused) {
            await new Promise(res => setTimeout(res, 100));
        }
        currentStep = i;
        let step = steps[i];
        array = step.array;
        renderBars(step.active, step.swap);

        if (i === steps.length - 1) {
            let bars = document.querySelectorAll(".bar");
            for (let k = 0; k < bars.length; k++) {
                bars[k].classList.add("sorted");
                await new Promise(res => setTimeout(res, 30));
            }
            document.getElementById("startBtn").disabled = false;
            document.getElementById("newBtn").disabled = false;
            document.getElementById("algorithm").disabled = false;
        }
        await new Promise(res => setTimeout(res, speed));
    }
    isPlaying = false;
}

function togglePause() {
    if (!isPlaying) return;
    isPaused = !isPaused;
    const btn = document.querySelector("button[onclick='togglePause()']");
    btn.innerText = isPaused ? "▶ Resume" : "⏸ Pause";
}

function showComplexity(type) {
    const div = document.getElementById("complexity");
    const complex = {
        "Bubble": "🟢 Best: O(n) | 🟡 Avg: O(n²) | 🔴 Worst: O(n²)",
        "Selection": "🟢 Best: O(n²) | 🟡 Avg: O(n²) | 🔴 Worst: O(n²)",
        "Insertion": "🟢 Best: O(n) | 🟡 Avg: O(n²) | 🔴 Worst: O(n²)",
        "Quick": "🟢 Best: O(n log n) | 🟡 Avg: O(n log n) | 🔴 Worst: O(n²)",
        "Merge": "🟢 Best: O(n log n) | 🟡 Avg: O(n log n) | 🔴 Worst: O(n log n)",
        "Heap": "🟢 Best: O(n log n) | 🟡 Avg: O(n log n) | 🔴 Worst: O(n log n)"
    };
    div.innerHTML = complex[type] || "";
}

function showDescription(type) {
    const desc = document.getElementById("description");
    const descs = {
        "Bubble": "Bubble Sort repeatedly swaps adjacent elements.",
        "Selection": "Selection Sort selects minimum element each time.",
        "Insertion": "Insertion Sort builds sorted array step by step.",
        "Quick": "Quick Sort uses pivot and divide & conquer.",
        "Merge": "Merge Sort divides and merges sorted halves.",
        "Heap": "Heap Sort uses binary heap structure."
    };
    desc.innerText = descs[type] || "";
}

// Initial Call
generateArray();
