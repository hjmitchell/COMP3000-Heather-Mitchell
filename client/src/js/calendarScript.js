//Define vars for current month and year
let currentMonth;
let currentYear;
//Define object to store calendar events
let events = {};

//Generate calendar fn
function generateCalendar(year, month) {
    //Dynamically create months data...
    //Get last day of prev month, set day param to 0
    let firstDay = new Date(year, month - 1, 0);
    //Get last day of current month, set day param to 0
    let lastDay = new Date(year, month, 0);
    //Get number of days between firstDay and lastDay
    let daysInMonth = lastDay.getDate();

    //Get table from HTML and clear previous content
    let tableBody = document.querySelector('#calendar tbody');
    tableBody.innerHTML = '';

    //Variable to fill in dates in calendar cells
    let date = 1;
    //Iterate over calendar rows, max 6 rows (weeks)
    for (var i = 0; i < 6; i++) {
        //Insert row
        let row = tableBody.insertRow();
        //Iterate cells in row, 7 times (days)
        for (var j = 0; j < 7; j++) {
            //Insert cell
            let cell = row.insertCell();

            //Check whether current cell should be empty or contain date
            //Empty if before first day of month or already filled all days in month
            if ((i === 0 && j < firstDay.getDay()) || (date > daysInMonth)) {
                //Leave cell empty
                cell.innerHTML = '';
            } else {
                //Set date and increment date for next iteration
                cell.innerHTML = date;
                date++;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    //Get current date
    let currentDate = new Date();
    //Get month and year from current date
    //Current month +1 due to first month being value 0
    currentMonth = currentDate.getMonth() + 1;
    currentYear = currentDate.getFullYear();

    //Call gen calendar fn and update month fn
    generateCalendar(currentYear, currentMonth);
    updateMonthLabel();


    // Set today's date as the default selected date
    let today = currentDate.getDate();
    let cells = document.querySelectorAll('td');

    cells.forEach(function (cell) {
        if (cell.innerHTML === today.toString()) {
            cell.classList.add('clicked');
            displayEventDetails(today);
        }
    });

    //Add event listener for cell clicks
    document.getElementById('calendar').addEventListener('click', function (event) {
        //Check if clicked element is a TD and not empty
        if (event.target.tagName === 'TD' && event.target.innerHTML !== '') {
            //Remove 'clicked' class from all cells
            let allCells = document.querySelectorAll('td');
            allCells.forEach(function (cell) {
                cell.classList.remove('clicked');
            });
            //Add 'clicked' class to clicked cell to style in stylesheet
            event.target.classList.add('clicked');

            //Display event details for clicked date
            displayEventDetails(event.target.innerHTML);
        }
    });

    //Event listener for Add btn
    document.getElementById('addBtn').addEventListener('click', function () {
        //Get clicked cell
        let clickedCell = document.querySelector('td.clicked');
        if (clickedCell) {
            //Get date of clicked cell
            let date = clickedCell.innerHTML;

            //Get event details from input fields
            let eventTitle = document.getElementById('eventTitle').value;
            let eventTime = document.getElementById('eventTime').value;
            let eventDuration = document.getElementById('eventDuration').value;

            // Check if required fields are not empty
            if (eventTitle.trim() === '' || eventTime.trim() === '' || eventDuration.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }

            // Convert input time to Date object
            let startTime = new Date(`2023-08-23T${eventTime}:00`);
            let endTime = new Date(startTime.getTime() + eventDuration * 60000); // Convert minutes to milliseconds

            // Check for overlapping events
            if (events[date] && events[date].length > 0) {
                let overlappingEvent = events[date].find(event => {
                    let existingStartTime = new Date(`2023-08-23T${event.time}:00`);
                    let existingEndTime = new Date(existingStartTime.getTime() + event.duration * 60000);

                    return (
                        (startTime >= existingStartTime && startTime < existingEndTime) ||
                        (endTime > existingStartTime && endTime <= existingEndTime) ||
                        (startTime <= existingStartTime && endTime >= existingEndTime)
                    );
                });

                if (overlappingEvent) {
                    let confirmation = confirm('Event overlaps with an existing event.');
                    if (!confirmation) {
                        return;
                    }
                }
            }

            //Add event to events object
            events[date] = events[date] || [];
            events[date].push({ title: eventTitle, time: eventTime, duration: eventDuration });

            clickedCell.classList += " eventPresent"

            // Clear text boxes after submit
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventTime').value = '';
            document.getElementById('eventDuration').value = '30';

            //Display updated event details
            displayEventDetails(date);

        }
    });
});

//Update month/year title fn
function updateMonthLabel() {
    document.getElementById('currentMonth').innerText = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', { month: 'long' }) + ' ' + currentYear;
}

//Navigate to previous month fn
function prevMonth() {
    //Decrement month by 1
    currentMonth--;
    //Check if last month is last year
    if (currentMonth === 0) {
        //Set month to December and decrement year by 1
        currentMonth = 12;
        currentYear--;
    }
    //Update calendar and title with new month data
    generateCalendar(currentYear, currentMonth);
    updateMonthLabel();
}
//Navigate to next month fn
function nextMonth() {
    currentMonth++;
    if (currentMonth === 13) {
        currentMonth = 1;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
    updateMonthLabel();
}

function displayEventDetails(date) {
    //Get div to display event
    let eventDetails = document.getElementById('eventDetails');
    //Get month name
    let monthName = new Date(currentYear, currentMonth - 1, 1).toLocaleString('default', { month: 'long' });
    //Display event date in format "Month DD, YYYY"
    eventDetails.innerHTML = `${monthName} ${date}, ${currentYear}:`;
    //Display events
    if (events[date] && events[date].length > 0) {
        events[date].forEach(function (event) {
            let dateString = "2023-08-23T" + event.time + ":00";
            let parsedDateString = Date.parse(dateString);

            let durationString = event.duration * 60000;
            let result = parsedDateString + durationString

            result = new Date(result);
            let hour = result.getHours();
            let minute = result.getMinutes();

            eventDetails.innerHTML += `<p class="event">${event.title} at ${event.time} until ${hour}:${minute}</p>`;
        });
    } else {
        eventDetails.innerHTML += `<p class="event">No lessons on this date</p>`;
    }
}