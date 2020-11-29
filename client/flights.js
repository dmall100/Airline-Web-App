
let list_flights = []

const setFlights= (data) => {
  list_flights = data;
}

/* async function list_flights() {
  console.log("#searching")

  // use try... catch... to catch error
  try {

    // insert new avflight to "http://localhost:1385/avflights", with "POST" method
    const response = await fetch("http://localhost:1385/listflights");
    const jsonData = await response.json();
    // refresh the page when inserted
    setflights(jsonData)
    displayavflights();
    document.body.innerHTML += `<br><tbody>${avflights[0].origin}</tbody></br>`;
    //location.reload();

  } catch (err) {
    console.log(err.message);
  }
} */

const passenger_info = (id) => {

  console.log(id);

}

// function to display todos
const displayFlights = () => {
  const flightsTable = document.querySelector('#flights-table');

  // display all todos by modifying the HTML in "todo-table"
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
    <th><button class="btn btn-warning" type="button" data-toggle="modal" data-target="#flight-info" >Info</button></th>
    </tr>`;
  })
  flightsTable.innerHTML = tableHTML;
  //onclick="passenger_info(${flights.flight_id})"
}

selectFlights();

// The following are async function to select, insert, update and delete todos
// select all the todosaa
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