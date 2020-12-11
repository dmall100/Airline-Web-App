// assign seats to customer and ask whether they would like a meal
let list_seats = []
let boarding_pass = []
let trip_no = 1; 
const setSeats = (data) => {
    list_seats = data;
}

const setBoardingPass = (data1) => {
    boarding_pass = data1;
}

const setTripno = (data) => {
    trip_no = data; 
}

async function getFlightid() {
    try{    
        const response = await fetch(`http://localhost:1385/${trip_no}`);
        const jsonData = await response.json();
        
        setFlightid(jsonData[0].flight_id1); 
        return insert_boarding(); 


    }catch(err){
        console.log(err.message); 
    }
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
        setTripno(jsonData[0].trip_no); 
        getFlightid(jsonData[0].trip_no); 
        setFlightid(); 
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
        `<th>${passInfo.trip_no}</th>
        <th>${passInfo.flight_id}</th>
        <th>${passInfo.passenger_name}</th>
        <th>${passInfo.passenger_id}</th>
        <th>${passInfo.passenger_dob}</th>
        <th><input class = "input-box" id = "seat-no"></input></th>
        <th><input class = "input-box" id = "baggage-no" type = "number"></input></th>
    </tr>`;
    })
    bpassTable.innerHTML = tableHTML 
    document.innerHTML +=  `<button class = "nav-btn" > Board Me </button>`; 
    ;
}