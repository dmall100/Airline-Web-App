

world = [] // country, city list 
const setworld = (data) => {
  world = data; 
}
GetWorld(); 
async function GetWorld(){
  try{
    const response = await fetch(`http://localhost:1385/world_list`);
    const jsonData = await response.json();
    setworld(jsonData);
    setoptions();
    const optionsList = document.querySelectorAll(".option");



    optionsList.forEach(o => {
    o.addEventListener("click", () => {
    
    selected.innerHTML = o.querySelector("label").innerHTML;
    

    optionsContainer.classList.remove("active");
    });
    return false; 
});
  }catch(err){
    console.log(err.message)
  }
}
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});


const setoptions = () => {
  world.forEach(w => {
    optionsContainer.innerHTML += `<div class = "option">
    <input 
    type = "radio"
    class = radio 
    id = "${w.city_id}"
    name = "category"/> 
    <label for="d_city"> ${w.city}, ${w.country} </label>
    </div>`;
  });
  
}

let flights = [];
let chosen_flight = [];
let no_ticket = 1;
const setflights= (data) => {
  flights = data;
}

async function check_avflights(){
  return false; 
}
async function browse() {
  const id = document.querySelector("#b_no_ticket").value;
  try {
    const response = await fetch(`http://localhost:1385/flights/${id}`);
    const jsonData = await response.json();
    setflights(jsonData);
    displayflights();
    return false; 
  } catch (err) {
    console.log(err.message);
  }
  //CHECK IF NUMBER OF TICKETS AVAILABLE 
  //If available --> display 
  //if no available --> alert user 
  // read the avflight description from input
  //const origin = document.querySelector('#origin_city').value;
  //const destination = document.querySelector('#destination_city').value;
  //const connection = document.querySelector('#conn').value;
  //const no_pass = document.querySelector('#pass_no').value;
  //console.log(origin);-->

  // use try... catch... to catch error
}


async function search() {
  const id = document.querySelector("#s_no_ticket").value;
  const d_city =document.querySelector("#d_city").value; 
  const d_date =document.querySelector("#d_date").value;
  const a_city =document.querySelector("#a_city").value; 
  const a_date =document.querySelector("#a_date").value;
  try {
    const response = await fetch(`http://localhost:1385/flights/${id}/${d_city}+${a_city}`);
    const jsonData = await response.json();
    setflights(jsonData);
    displayflights();
    return false; 
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
  if(flights.length > 0)
  {
    const flightsTable = document.querySelector('#flights-table');

    let tableHTML = "";
    flights.map(flight =>{
      tableHTML +=
      `<tr>
      <th>${flight.departure_city}</th>
      <th> $${flight.scheduled_departure}</th>
      <th>${flight.arrival_city}</th>
      <th> $${flight.scheduled_arrival}</th>
      <th> <button onclick =  "location.href = 'costumer_info.html'; chooseflight('${flight.value}'); return false;"> select </button></th>
    </tr>`;
    })
    flightsTable.innerHTML = tableHTML;
  }
  else{
    const flightsTable = document.querySelector('#flights-table');
    flightsTable.innerHTML = '<tr> No available flights </tr>';
  }
  
}

const chooseflight = (data) => {
  chosen_flight = data;
  //check flight availability 
  const flight_info = document.querySelector('#flight-info');
  //location.reload();
  document.getElementById("flight-info").innerHTML =`${data.flight_id}` ;
  


}