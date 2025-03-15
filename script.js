// Function to record time-in and time-out
function recordTime() {
    // Get input values
    let date = document.getElementById("date").value;
    let timeIn = document.getElementById("timeIn").value;
    let timeOut = document.getElementById("timeOut").value;

    // Validate input (ensure fields are not empty)
    if (!date || !timeIn || !timeOut) {
        alert("Please fill in all fields.");
        return;
    }

    // Convert time to Date objects for calculation
    let timeInDate = new Date(`2025-01-01T${timeIn}:00`);
    let timeOutDate = new Date(`2025-01-01T${timeOut}:00`);

    // Ensure time-out is after time-in
    if (timeOutDate <= timeInDate) {
        alert("Time Out must be later than Time In.");
        return;
    }

    // Calculate total hours worked
    let totalHours = (timeOutDate - timeInDate) / (1000 * 60 * 60); // Convert milliseconds to hours

    // Subtract 1 hour unpaid break
    totalHours -= 1;
    if (totalHours < 0) totalHours = 0; // Ensure no negative hours

    // Format the result
    totalHours = totalHours.toFixed(2); // Round to 2 decimal places

    // Save record
    let record = { date, timeIn, timeOut, totalHours };
    saveRecord(record);

    // Refresh the displayed records
    displayRecords();

    // Clear input fields after recording
    document.getElementById("date").value = "";
    document.getElementById("timeIn").value = "";
    document.getElementById("timeOut").value = "";

    // Refocus on the date field for faster entry
    document.getElementById("date").focus();
}

// Function to save record to local storage
function saveRecord(record) {
    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];
    records.push(record);
    localStorage.setItem("timeRecords", JSON.stringify(records));
}

// Deletes a specific record by date
function deleteRecord(date) {
    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];

    // Show confirmation alert before deleting
    let confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) {
        return;
    }

// Filter out the record with the matching date
records = records.filter(record => record.date !== date);

    // Save updated records back to local storage
    localStorage.setItem("timeRecords", JSON.stringify(records));

    // Refresh the displayed records and overall hours
    displayRecords();
}

// Function to display records
function displayRecords() {
    let recordList = document.getElementById("recordList");
    let overallHoursElement = document.getElementById("overallHours");
    recordList.innerHTML = ""; // Clear previous list

    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];
    let overallHours = 0; // Initialize overall hours counter

    // Sort records by date (newest first)
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    records.forEach((record) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>Date:</strong> ${record.date} | 
                        <strong>Time In:</strong> ${record.timeIn} | 
                        <strong>Time Out:</strong> ${record.timeOut} | 
                        <strong>Total Hours:</strong> ${record.totalHours} hrs`;

// Create delete button dynamically
let deleteButton = document.createElement("button");
deleteButton.textContent = "🗑️ Delete";
deleteButton.classList.add("delete");
deleteButton.onclick = function () {
    deleteRecord(record.date);
};


li.appendChild(deleteButton);
recordList.appendChild(li);

        // Sum up total hours
        overallHours += parseFloat(record.totalHours);
    });

    updateSalary(overallHours);

    // Display the overall hours
    overallHoursElement.textContent = overallHours.toFixed(2);
}

// Load saved records when the page loads
window.onload = displayRecords;

// Define your hourly rate
const hourlyRate = 80.625;

// Function to toggle salary display
function toggleSalary() {
    let salaryDiv = document.getElementById("salaryDisplay");
    let toggleButton = document.getElementById("toggleSalary");

    if (salaryDiv.style.display === "none") {
        salaryDiv.style.display = "block";
        toggleButton.textContent = "🙉 Hide Salary";
    } else {
        salaryDiv.style.display = "none";
        toggleButton.textContent = "👁️ Show Salary";
    }z
}

// Function to update and display salary
function updateSalary(overallHours) {
    let salaryAmount = overallHours * hourlyRate;
    document.getElementById("salaryAmount").textContent = salaryAmount.toFixed(2);
}


document.addEventListener("DOMContentLoaded", function () {
    let modal = document.getElementById("welcomeModal");
    let modalContent = document.querySelector(".modal-content");
    let closeModal = document.getElementById("closeModal");

    // Show the modal
    modal.style.display = "flex";

        // Hide the modal with animation when button is clicked
    closeModal.addEventListener("click", function () {
        modal.classList.add("fadeOut"); // Fade out background
        modalContent.classList.add("fadeOut"); // Shrink & fade out content

        setTimeout(() => {
            modal.style.display = "none"; // Completely hide modal after animation
        }, 400); // Matches animation duration (0.4s)
    });
});

function exportData() {
    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];
    let overallHours = parseFloat(document.getElementById("overallHours").textContent) || 0;
    let salary = overallHours * hourlyRate;

    if (records.length === 0) {
        alert("No data to export.");
        return;
    }

    let dataString = "Work Records\n";
    dataString += "====================\n";

    records.forEach(record => {
        dataString += `📅 Date: ${record.date}\n`;
        dataString += `⏰ Time In: ${record.timeIn}\n`;
        dataString += `⏳ Time Out: ${record.timeOut}\n`;
        dataString += `⌛ Total Hours: ${record.totalHours} hrs\n`;
        dataString += "--------------------\n";
    });

    dataString += `\n👥 Overall Hours: ${overallHours.toFixed(2)} hrs\n`;
    dataString += `💰 Salary: ₱${salary.toFixed(2)}\n`;

    // Create a Blob and trigger download
    let blob = new Blob([dataString], { type: "text/plain" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "WorkRecords.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Attach event listener to the button
document.getElementById("exportData").addEventListener("click", exportData);
