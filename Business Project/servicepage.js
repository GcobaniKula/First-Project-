document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("myForm");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    // Reset previous error messages
    resetErrors();

    // Get values from form inputs
    const selectedOption = document.getElementById("selectList").value;
    const pickupOne = document.getElementById("pickupOne").value.trim();
    const pickupTwo = document.getElementById("pickupTwo").value.trim();
    const selectedTime = document.getElementById("selectedTime").value;
    const tripType = document.getElementById("tripType").value;

    // Validate form inputs
    if (!selectedOption || !pickupOne || !pickupTwo || !selectedTime || !tripType) {
      displayErrorMessage("Please complete the form.");
      return;
    }

    // Calculate base price based on selected option
    let basePrice;
    let estimatedTime;

    switch (selectedOption.toLowerCase()) {
      case "taxi":
        basePrice = 20;
        estimatedTime = calculateEstimatedTime(selectedTime);
        break;
      case "bus":
        basePrice = 22;
        estimatedTime = calculateEstimatedTime(selectedTime);
        // Adjust price if selected time is within specified peak hours
        if (isPeakTime(selectedTime)) {
          basePrice += 10;
        }
        break;
      case "train":
        basePrice = 10;
        estimatedTime = "30 minutes"; // Train always takes 30 minutes
        // Disable selectedTime input for Train option
        document.getElementById("selectedTime").disabled = true;
        break;
      default:
        basePrice = 0; // Default case if somehow an invalid option is selected
        estimatedTime = "";
    }

    // Adjust price for Return Trip
    let totalPrice = basePrice;
    if (tripType === "returnTrip") {
      totalPrice *= 2;
    }

    // Display the calculated price
    const totalPriceElement = document.getElementById("total-price");
    totalPriceElement.textContent = `Total Price: R${totalPrice}`;

    // Display the estimated time
    const estimatedTimeElement = document.getElementById("estimated-time");
    estimatedTimeElement.textContent = `Estimated Time: ${estimatedTime}`;

    // Display peak hour message
    const peakHourMessageElement = document.getElementById("peak-hour-message");
    peakHourMessageElement.textContent = peakHourMessage;

    // Optionally, you can show any validation errors or messages based on form inputs
    // For simplicity, let's assume no validation errors are implemented here.
  });

  // Reset form on clicking the Reset button
  form.addEventListener("reset", function() {
    // Reset all form fields
    form.reset();
    // Enable selectedTime input if it was disabled
    document.getElementById("selectedTime").disabled = false;
    // Reset total price display
    document.getElementById("total-price").textContent = "Total Price :";
    // Reset estimated time display
    document.getElementById("estimated-time").textContent = "Estimated Time :";
    // Clear any error messages
    resetErrors();
  });

  // Function to reset error messages
  function resetErrors() {
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("pickupOneError").textContent = "";
    document.getElementById("pickupTwoError").textContent = "";
  }

  // Function to display error message
  function displayErrorMessage(message) {
    document.getElementById("errorMessage").textContent = message;
  }

  // Function to check if selected time is within peak time ranges
  function isPeakTime(timeStr) {
    // Extract hours and minutes from time string
    const [hours, minutes] = timeStr.split(":").map(Number);

    // Define peak time ranges (04:00-08:00 and 16:00-20:00 in 24-hour format)
    // Convert to 24-hour format for comparison
    const startTime1 = "04:00";
    const endTime1 = "08:00";
    const startTime2 = "16:00";
    const endTime2 = "20:00";

    // Function to convert time to minutes for easy comparison
    function timeToMinutes(time) {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    }

    const selectedTimeMinutes = timeToMinutes(timeStr);
    const start1Minutes = timeToMinutes(startTime1);
    const end1Minutes = timeToMinutes(endTime1);
    const start2Minutes = timeToMinutes(startTime2);
    const end2Minutes = timeToMinutes(endTime2);

    // Check if the selected time falls within any peak range
    if (
      (selectedTimeMinutes >= start1Minutes && selectedTimeMinutes <= end1Minutes) ||
      (selectedTimeMinutes >= start2Minutes && selectedTimeMinutes <= end2Minutes)
    ) {
      return true;
    }

    return false;
  }

  // Function to calculate estimated time based on selected time
  function calculateEstimatedTime(timeStr) {
    // Extract hours from time string
    const [hours] = timeStr.split(":").map(Number);

    // Define peak hours (4:00 to 8:00 and 16:00 to 20:00)
    const peakStart1 = 4;
    const peakEnd1 = 8;
    const peakStart2 = 16;
    const peakEnd2 = 20;

    // Check if the selected time is during peak hours
    if ((hours >= peakStart1 && hours <= peakEnd1) || (hours >= peakStart2 && hours <= peakEnd2)) {
      return "1.5 hours"; // Peak time estimated time
    } else {
      return "30 minutes"; // Normal time estimated time
    }
  }
});

