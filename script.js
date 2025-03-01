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

    // Display the overall hours
    overallHoursElement.textContent = overallHours.toFixed(2);
}

// Load saved records when the page loads
window.onload = displayRecords;
