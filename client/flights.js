let list_flights = []
let list_passengers = []
selectFlights();

const setFlights = (data) => {
    list_flights = data;
}

const setPassengers = (data1) => {
    list_passengers = data1;
}
 
// function to display flights
const displayFlights = () => {
    const flightsTable = document.querySelector('#flights-table');

    // display all flights by modifying the HTML in "flights-table"
    let tableHTML = "";
    list_flights.map(flights => {
        tableHTML +=
            `<tr key=${flights.flight_id}>
    <th>${flights.flight_no}</th>
    <th>${flights.scheduled_departure}</th>
    <th>${flights.scheduled_arrival}</th>
    <th>${flights.departure_airport}</th>
    <th>${flights.arrival_airport}</th>
    <th>${flights.status}</th>
    <th>${flights.aircraft_code}</th>
    <th>${flights.seats_available}</th>
    <th>${flights.seats_booked}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#flight-info" onclick="selectPassengers(${flights.flight_id})">Info</button></th>
    </tr>`;
    })
    flightsTable.innerHTML = tableHTML;
}

// function to display passengers
const displayPassengers = () => {
    const passengersTable = document.querySelector('#passengers-table');

    // display all flights by modifying the HTML in "passengers-table"
    let tableHTML1 = "";
    list_passengers.map(passengers => {
        tableHTML1 +=
            `<th>${passengers.seat_no}</th>
    <th>${passengers.passenger_name}</th>
    </tr>`;
    })
    passengersTable.innerHTML = tableHTML1;
}


// select all the flights
async function selectFlights() {
    // use try... catch... to catch error 
    try {

        // GET all flights from "http://localhost:1385/list_flights"
        const response = await fetch("http://localhost:1385/list_flights")
        const jsonData = await response.json();

        setFlights(jsonData);
        displayFlights();

    } catch (err) {
        console.log(err.message);
    }
}

// select all the passengers
async function selectPassengers(id) {
    // use try... catch... to catch error
    try {
        // GET all passengers from "http://localhost:1385/list_flights/${code}"
        const response = await fetch(`http://localhost:1385/list_flights/${id}`);
        const jsonData = await response.json();

        setPassengers(jsonData);
        displayPassengers();

    } catch (err) {
        console.log(err.message);
    }
}