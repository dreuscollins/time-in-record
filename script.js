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

// NEW FUNCTION: Deletes a specific record by index
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];

    // Show confirmation alert before deleting
    let confirmDelete = confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) {
        return; // Stop the function if the user cancels
    }

    // Remove the selected record from the array
    records.splice(index, 1);

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
    records.sort((a, b) => new Date(b.date) - new Date(a.date));

    records.forEach((record, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>Date:</strong> ${record.date} | 
                        <strong>Time In:</strong> ${record.timeIn} | 
                        <strong>Time Out:</strong> ${record.timeOut} | 
                        <strong>Total Hours:</strong> ${record.totalHours} hrs`;

// Create Edit button dynamically
let editButton = document.createElement("button");
editButton.textContent = "✏️ Edit";
editButton.classList.add("edit");
editButton.onclick = function () {
    editRecord(index);
};

// Create delete button dynamically
let deleteButton = document.createElement("button");
deleteButton.textContent = "🗑️ Delete";
deleteButton.classList.add("delete");
deleteButton.onclick = function () {
    deleteRecord(index);
};


// Append delete button to the list item
li.appendChild(editButton); // Append Edit button
li.appendChild(deleteButton);


// Add list item to the record list
recordList.appendChild(li);

        // Sum up total hours
        overallHours += parseFloat(record.totalHours);
    });

    // Display the overall hours
    overallHoursElement.textContent = overallHours.toFixed(2);
}

// Load saved records when the page loads
window.onload = displayRecords;

let editIndex = -1;

function editRecord(index) {
    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];
    let record = records[index]; // Get the record to edit

    // Fill input fields with the existing data
    document.getElementById("date").value = record.date;
    document.getElementById("timeIn").value = record.timeIn;
    document.getElementById("timeOut").value = record.timeOut;

    // Set global editIndex so we update instead of adding new
    editIndex = index;
}

// to handle updates
function recordTime() {
    let date = document.getElementById("date").value;
    let timeIn = document.getElementById("timeIn").value;
    let timeOut = document.getElementById("timeOut").value;

    if (!date || !timeIn || !timeOut) {
        alert("Please fill in all fields.");
        return;
    }

    let timeInDate = new Date(`2025-01-01T${timeIn}:00`);
    let timeOutDate = new Date(`2025-01-01T${timeOut}:00`);

    if (timeOutDate <= timeInDate) {
        alert("Time Out must be later than Time In.");
        return;
    }

    let totalHours = (timeOutDate - timeInDate) / (1000 * 60 * 60);
    totalHours -= 1; // Subtract unpaid break
    if (totalHours < 0) totalHours = 0;
    totalHours = totalHours.toFixed(2);

    let records = JSON.parse(localStorage.getItem("timeRecords")) || [];

    if (editIndex === -1) {
        // If no record is being edited, add new entry
        records.push({ date, timeIn, timeOut, totalHours });
    } else {
        // If editing an existing record, update it
        records[editIndex] = { date, timeIn, timeOut, totalHours };
        editIndex = -1; // Reset edit state
    }

    localStorage.setItem("timeRecords", JSON.stringify(records));
    displayRecords();

    // Clear inputs after saving
    document.getElementById("date").value = "";
    document.getElementById("timeIn").value = "";
    document.getElementById("timeOut").value = "";
}
