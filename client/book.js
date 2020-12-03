
world = [] // country, city list 
let depart_city = [];
let arrive_city = []; 
let flights = [];
let no_ticket = [];
let ch_flight = []; 

const set_no_ticket = (data) => {
  no_ticket = data; 
}
const set_chosen_flight = (data) => {
  ch_flight = data; 
}
const setworld = (data) => {
  world = data; 
}

const setdept_id = (data) => {
  depart_city = data; 
}

const setarr_id = (data) => {
  arrive_city = data; 
}


const setflights= (data) => {
  flights = []; 
  flights = data;
}



set_world_list();
async function set_world_list() {
  async function GetWorld(){
    try{
      const response = await fetch(`http://localhost:1485/world_list`);
      const jsonData = await response.json();
      setworld(jsonData);
      setoptions('d');
      setoptions('o'); 
    }catch(err){
      console.log(err.message)
    }
  }
  
  GetWorld(); 

  
  const o_optionsContainer = document.querySelector(`#o-options-container`);
  
  const o_selected = document.querySelector(`#o-selected`);
  
  o_selected.addEventListener("click", () => {
    o_optionsContainer.classList.toggle("active");
  });

  const d_optionsContainer = document.querySelector(`#d-options-container`);
  
  const d_selected = document.querySelector(`#d-selected`);
  
  d_selected.addEventListener("click", () => {
    d_optionsContainer.classList.toggle("active");
  });
  
  
  const setoptions = (data) => {
    optionsContainer = o_optionsContainer; 
    if(data == 'd'){
      optionsContainer = d_optionsContainer; 
    }
    world.forEach(w => {
      optionsContainer.innerHTML += `<div class = "option-${data}">
      <input 
      type = "radio"
      class = radio 
      value = "${w.city_id}"
      id =  "${w.city_id}"
      name = "category"/> 
      <label for="d_city"> ${w.city}, ${w.country} </label>
      </div>`;
    });
    const optionsList = document.querySelectorAll(`.option-o`);
    optionsList.forEach(o => {
      o.addEventListener("click", () => {
      
      o_selected.innerHTML = o.querySelector("label").innerHTML;
      
      o_optionsContainer.classList.remove("active");
      setdept_id(o.querySelector("input").value); 
      });
    })
    const optionsList1 = document.querySelectorAll(`.option-d`);
    optionsList1.forEach(o => {
      o.addEventListener("click", () => {
      
      d_selected.innerHTML = o.querySelector("label").innerHTML;
  
      d_optionsContainer.classList.remove("active");
      setarr_id(o.querySelector("input").value); 
      //document.body.innerHTML = `<h2> ${o.querySelector("input").value}</h2>`
      });
    })
    
  }

  
}




async function browse() {
  const id = document.querySelector("#b_no_ticket").value;
  try {
    const response = await fetch(`http://localhost:1385/flights/${id}`);
    const jsonData = await response.json();
    set_no_ticket(id); 
    setflights(jsonData);
    displayflights();
    return false; 
  } catch (err) {
    console.log(err.message);
  }
}


async function search() {
  const id = document.querySelector("#s_no_ticket").value;
  const d_city = depart_city; 
  //const d_date =document.querySelector("#d_date").value;
  const a_city = arrive_city;
  //const a_date =document.querySelector("#a_date").value;
  try {
    const response = await fetch(`http://localhost:1485/flights/${id}/${d_city}-${a_city}`);
    const jsonData = await response.json();
    set_no_ticket(id); 
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
    const response = await fetch("http://localhost:1485/flights", {
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
  if(flights.length > 0)
  {
    let tableHTML = "";
    flights.map(flight =>{
      tableHTML +=
      `<tr id = "${flight.flight_id}" class = "avail_flights">
      <th>${flight.departure_city}</th>
      <th> $${flight.scheduled_departure}</th>
      <th>${flight.arrival_city}</th>
      <th> $${flight.scheduled_arrival}</th>
      <th> <button class = "s-btn"> select </button></th>
    </tr>`;    
    });
    flightsTable.innerHTML = tableHTML;

    
  }
  else{
    flightsTable.innerHTML = '<tr> No available flights </tr>';
  }
}






const cost_onload = () => {
  document.body.innerHTML = `<h3>Flight: ${no_ticket}</h3>`;
  const flightinfo = document.querySelector("#flight-info");
}