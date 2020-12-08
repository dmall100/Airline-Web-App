// assign seats to customer and ask whether they would like a meal
let list_seats = []
let boarding_pass = []

const setSeats = (data) => {
    list_seats = data;
}

const setBoardingPass = (data1) => {
    boarding_pass = data1;
}

// Use ticket number from input box to get boarding pass info
async function getPassengerInfo() {

    const ticket_no = document.querySelector('#ticket-number').value;

    try {
        const response = await fetch(`http://localhost:1385/check_in/${ticket_no}`);
        const jsonData = await response.json();

        if (Object.keys(jsonData).length > 0) {
            document.getElementById("bpass-display").style.display = "block";
            document.getElementById("error-display").style.display = "none";
        } else {
            document.getElementById("bpass-display").style.display = "none";
            document.getElementById("error-display").style.display = "block";
        }

        console.log(Object.keys(jsonData).length);

        setBoardingPass(jsonData);
        displayBoardingPass();

    } catch (err) {
        document.getElementById("bpass-display").style.display = "none";
        document.getElementById("error-display").style.display = "block";
        console.log(err.message);
    }
}

// function to display boarding pass
const displayBoardingPass = () => {
    const bpassTable = document.querySelector('#boarding-pass');

    // display boarding pass by modifying the HTML in "boarding-pass"
    let tableHTML = "";
    boarding_pass.map(passInfo => {
        tableHTML +=
            `<th>${passInfo.ticket_no}</th>
        <th>${passInfo.flight_id}</th>
        <th>${passInfo.boarding_no}</th>
        <th>${passInfo.seat_no}</th>
        <th>${passInfo.checked_bags}</th>
    </tr>`;
    })
    bpassTable.innerHTML = tableHTML;
}