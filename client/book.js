
let flights = []
let chosen_flight = 0;
const setflights= (data) => {
  flights = data;
}

async function search() {
  console.log("#searching")
  // read the avflight description from input
  //const origin = document.querySelector('#origin_city').value;
  //const destination = document.querySelector('#destination_city').value;
  //const connection = document.querySelector('#conn').value;
  //const no_pass = document.querySelector('#pass_no').value;
  //console.log(origin);-->

  // use try... catch... to catch error
  try {

    // insert new avflight to "http://localhost:5000/avflights", with "POST" method
    const response = await fetch("http://localhost:1385/flights");
    const jsonData = await response.json();
    console.log(jsonData)
    for(var i = 0; i < 1;i++){
       setflights(jsonData);
       displayflights();
    }

  } catch (err) {
    console.log(err.message);
  }
}

async function insert_pass() {
  const name = document.querySelector("#pass-name").value;

  try {
    const body = {name: name}
    const response = await fetch("http://localhost:1385/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    location.reload();
  } catch(err) {
    console.log(err.message)
  }
}
const displayflights = () => {
  
  const flightsTable = document.querySelector('#flights-table');

  // display all todos by modifying the HTML in "todo-table"
  let tableHTML = "";
  flights.map(flight =>{
    tableHTML +=
    `<tr>
    <th>${flight.departure_city}</th>
    <th> $${flight.scheduled_departure}</th>
    <th>${flight.arrival_city}</th>
    <th> $${flight.scheduled_arrival}</th>
    <th> <button onclick =  "chooseflight('${flight.value}'); return false;"> select </button></th>
    </tr>`;
  })
  flightsTable.innerHTML = tableHTML;
}

const chooseflight = (data) => {
  chosen_flight = data;
  //check flight availability 
  location.href = 'costumer_info.html';
  const flight_info = document.querySelector('#flight-info');
  //location.reload();
  flight_info.innerHTML =`<h3> ${data.flight_id}</h3>` ;

}