
let list_flights = []
let list_passengers = []

const setFlights= (data) => {
  list_flights = data;
}

const setPassengers = (data) => {
  list_passengers = data;
}

// function to display flights
const displayFlights = () => {
  const flightsTable = document.querySelector('#flights-table');

  // display all flights by modifying the HTML in "flights-table"
  let tableHTML = "";
  list_flights.map(flights =>{
    tableHTML +=
    `<tr key=${flights.flight_id}>
    <th>${flights.flight_no}</th>
    <th>${flights.scheduled_departure}</th>
    <th>${flights.scheduled_arrival}</th>
    <th>${flights.departure_airport}</th>
    <th>${flights.arrival_airport}</th>
    <th>${flights.aircraft_code}</th>
    <th>${flights.seats_available}</th>
    <th>${flights.seats_booked}</th>
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#flight-info" onclick="selectPassengers(${flights.aircraft_code})">Info</button></th>
    </tr>`;
  })
  flightsTable.innerHTML = tableHTML;
}

// function to display passengers
const displayPassengers = () => {
  const passengersTable = document.querySelector('#passengers-table');

  // display all flights by modifying the HTML in "passengers-table"
  list_passengers.map(flights =>{
    tableHTML +=
    `<tr key=${flights.aircraft_code}>
    <th>${flights.flight_id}</th>
    <th>${flights.departure_airport}</th>
    <th> Test </th>
    </tr>`;
  })
  passengersTable.innerHTML = tableHTML;
}

selectFlights();

// The following are async function to select, insert, update and delete todos
// select all the todos
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
async function selectPassengers(code) {
  // use try... catch... to catch error
  try {
    
    // GET all passengers from "http://localhost:1385/list_flights/${code}"
    const response = await fetch("http://localhost:1385/list_flights/${code}")
    const jsonData = await response.json();

    setPassengers(jsonData);
    displayPassengers();

  } catch (err) {
    console.log(err.message);
  }
}