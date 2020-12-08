// assign seats to customer and ask whether they would like a meal
let list_seats = []
let boarding_pass = []

const setSeats = (data) => {
    list_seats = data;
}

const setBoardingPass = (data1) => {
    boarding_pass = data1;
}

// Use ticket number from input box to get info from ticket table
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

// // insert passenger info to tables and display boarding pass
// async function insertPassInfo() {
//     // read the ticket number and # of checked bags from input
//     const ticket = document.querySelector('#ticket-number').value;

//     // use try... catch... to catch error
//     try {

//         // insert new todo to "http://localhost:5000/todos", with "POST" method
//         const body = { ticket: ticket };
//         const response = await fetch("http://localhost:5000/todos", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(body)
//         });

//         // refresh the page when inserted
//         location.reload();
//         return false;

//     } catch (err) {
//         console.log(err.message);
//     }
// }