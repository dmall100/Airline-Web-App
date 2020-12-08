world = [] // country, city list 
let depart_city = [];
let arrive_city = [];
let flights = [];
let error_style = false;
const tick_price = 700;
const tax = 6.25 / 100;
let discounts = 0;


const set_no_ticket = (data) => {
    localStorage.setItem("no_ticket", JSON.stringify(data));
    localStorage.setItem("no_pass", "1");
}
const set_chosen_flight = (flight_id, a_city, d_city, a_date, d_date) => {
    localStorage.setItem("flight_id", JSON.stringify(flight_id));
    localStorage.setItem("a_city", JSON.stringify(a_city));
    localStorage.setItem("d_city", JSON.stringify(d_city));
    localStorage.setItem("a_date", JSON.stringify(a_date));
    localStorage.setItem("d_date", JSON.stringify(d_date));

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


const setflights = (data) => {
    flights = [];
    flights = data;
}



set_world_lisk();

function set_world_list() {
    async function GetWorld() {
        try {
            const response = await fetch(`http://localhost:1585/world_list`);
            const jsonData = await response.json();
            setworld(jsonData);
            setoptions('d');
            setoptions('o');
        } catch (err) {
            console.log(err.message)
        }
    }

    GetWorld();
    document = window.document;

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
        if (data == 'd') {
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
            });
        })

    }


}




async function browse() {
    const id = document.querySelector("#b_no_ticket").value;
    if (id <= 0) {
        alert("Please enter a valid ticket number");
        return false;
    }
    try {
        const response = await fetch(`http://localhost:1585/flights/${id}`);
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
    if (id <= 0) {
        alert("Please enter a valid ticket number");
        return false;
    }
    const d_city = depart_city;
    //const d_date =document.querySelector("#d_date").value;
    const a_city = arrive_city;
    //const a_date =document.querySelector("#a_date").value;
    try {
        const response = await fetch(`http://localhost:1585/flights/${id}/${d_city}-${a_city}`);
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
        const body = { name: name }
        const response = await fetch("http://localhost:1585/flights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        location.reload();
    } catch (err) {
        console.log(err.message)
    }
}



function add_cust_event() {
    const flight_rows = document.querySelectorAll(`.flight-row`);
    flight_rows.forEach(flight_row => {
            flight_row.querySelector("button").addEventListener("click", () => {
                const a_city = flight_row.querySelector("#a_city").textContent;
                const d_city = flight_row.querySelector("#d_city").textContent;
                const a_date = flight_row.querySelector("#a_date").textContent;
                const d_date = flight_row.querySelector("#d_date").textContent;
                const flight_id = flight_row.querySelector("#flight_id").textContent;
                set_chosen_flight(flight_id, a_city, d_city, a_date, d_date);
                document.location.href = 'costumer_info.html';
            });
        }

    );

    return false;
}

function displayflights() {
    const flightsTable = document.querySelector('#flights-table');
    if (flights.length > 0) {
        let tableHTML = "";
        flights.map(flight => {
            tableHTML +=

                `<div  >
      <tr class = "flight-row" >
      <th  id = "flight_id" >${flight.flight_id}</th>
      <th  id = "d_city" >${flight.departure_city}</th>
      <th  id = "d_date"> $${flight.scheduled_departure}</th>
      <th id = "a_city" >${flight.arrival_city}</th>
      <th  id = "a_date"> ${flight.scheduled_arrival}</th>
      <th> <button id = "select-btn" class = "btn-book-search"> select </button></th>
      </tr> 
      </div>`;

        });
        flightsTable.innerHTML = tableHTML;
        add_cust_event();

    } else {
        flightsTable.innerHTML = '<tr> No available flights </tr>';
    }

}




function verify(container, value, opt) {
    //opt 0: none , 1: date (BD), 2: date (exp), 3: id, 4: card num 
    var error = 0;

    let now = new Date();
    if (opt == 1) {
        let date = new Date(value);
        let legal_age = 18;
        let legal_date = new Date(now.getFullYear() - legal_age, now.getMonth(), now.getDay());
        if (date > legal_date) {
            alert("You must be 18 years or older to book a ticket!");
            error++;
        }
    } else if (opt == 2) {
        let date = new Date(value);
        if (date <= now) {
            alert("The expiration date entered is invalid!")
            error++;
        }
    } else if (opt == 3) {
        if (value.length > 10 || value.length < 8) { // id must be max 10 digits 
            alert("The ID number entered is invalid!");
            error++;
        }
    } else if (opt == 4) {
        if (value.length > 12 || value.length < 8) {
            alert("The card number entered is invalid!");
            error++;
        }
    } else if (opt == 5) {
        if (value.length != 10) {
            alert("The contact phone number entered is invalid!");
            error++;
        }
    }
    //null values 
    if (value == "NULL" || value == "" || error != 0) {
        container.style["border"] = "3px solid orange ";
        error++;
    }


    return error;
}




async function submit() {
    try {
        //insert into booking (now date, book_ref, class, STATUS, no_tickets)
        //insert into passenger
        //insert into ticket 

    } catch (err) {
        console.log(err.message);
    }
}




function review() {
    var errors = 0;
    var no_tick = parseInt(localStorage.getItem("no_ticket").replace(/['"$]+/g, ''));
    let passgs = [];
    let pass_cont, prefix, fname, lname, DOB, id_no, nation, id_exp, passg;

    //verify passenger input fields 
    for (var i = 1; i <= no_tick; i++) {
        //Fetch Parent Container 
        //For each child: 
        //Fetch container
        //Fetch value 
        //if value == "" --> change container style 
        //else --> proceed 


        pass_cont = document.querySelector(`#pass-${i}`);

        prefix_cont = pass_cont.querySelector("select");
        prefix = prefix_cont.value;
        errors += verify(prefix_cont, prefix, 0);

        fname_cont = pass_cont.querySelector("#pass-fname");
        fname = fname_cont.value;
        errors += verify(fname_cont, fname, 0);

        lname_cont = pass_cont.querySelector(`#pass-lname`)
        lname = lname_cont.value;
        errors += verify(lname_cont, lname, 0);

        DOB_cont = pass_cont.querySelector(`#pass-dob`);
        DOB = DOB_cont.value;
        errors += verify(DOB_cont, DOB, 1);


        id_no_cont = pass_cont.querySelector(`#id-num`);
        id_no = id_no_cont.value;
        errors += verify(id_no_cont, id_no, 3);

        nation_cont = pass_cont.querySelector(`#nationality`);
        nation = nation_cont.value;
        errors += verify(nation_cont, nation, 0);

        id_exp_cont = pass_cont.querySelector("#id-exp");
        id_exp = id_exp_cont.value;
        errors += verify(id_exp_cont, id_exp, 2);

        passg = { prefix, fname, lname, DOB, id_no, nation, id_exp };
        passgs.push(passg);
    }
    //Verify contact fields
    contact_cont = document.querySelector("#contact");
    ctname_cont = contact_cont.querySelector("#cont-name");
    ctname = ctname_cont.value;
    errors += verify(ctname_cont, ctname, 0);
    ct_nom_cont = contact_cont.querySelector("#cont-num");
    ct_nom = ct_nom_cont.value;
    errors += verify(ct_nom_cont, ct_nom, 5);
    ct_email_cont = contact_cont.querySelector("#cont-email");
    ct_email = ct_email_cont.value;
    errors += verify(ct_email_cont, ct_email, 0);

    //Verify Payments fields 
    pay_cont = document.querySelector("#pay-container");
    cname_cont = pay_cont.querySelector("#card-name");
    cname = cname_cont.value;
    errors += verify(cname_cont, cname, 0);
    c_nom_cont = pay_cont.querySelector("#card-num");
    c_nom = c_nom_cont.value;
    errors += verify(c_nom_cont, c_nom, 4);
    c_exp_cont = pay_cont.querySelector("#card-exp");
    c_exp = c_exp_cont.value;
    errors += verify(c_exp_cont, c_exp, 2);
    if (errors != 0) {
        alert("Please fix highlighted fields");
        return false;
    }
    return submit();
}

function calc_total(no_tick, discounts) {
    let tick_prices = no_tick * tick_price;
    return tick_prices + (tax * tick_price) - discounts;
}

function cost_onload() {
    var a_city = localStorage.getItem("a_city").replace(/['"$]+/g, '');
    var d_city = localStorage.getItem("d_city").replace(/['"$]+/g, '');
    var a_date = localStorage.getItem("a_date").replace(/['"$]+/g, '');
    var d_date = localStorage.getItem("d_date").replace(/['"$]+/g, '');

    const flightinfo = document.querySelector(".flight-container");

    flightinfo.innerHTML = `<div class = "flight-info"> 
  ${d_city}
  </div>
  <div class = "flight-info" > 
  ${d_date}
  </div>
  <div class = "flight-info" > 
  ${a_city}
  </div>
  <div class = "flight-info" > 
  ${a_date}
  </div>`;

    var no_tick = parseInt(localStorage.getItem("no_ticket").replace(/['"$]+/g, ''));

    const pass_container = document.querySelector("#travel-docs");

    let temp_container = "";

    for (let i = 1; i <= no_tick; i++) {
        temp_container += `
    <label class = "pass-label" for = ".pass-input"> Passenger ${i} </label>
    <div class = "pass-input" id = "pass-${i}"> 
      <div class = "mid">
        <select class = "input-box"> 
          <option class = prefix-op value = "NULL"> - </option>
          <option class = "prefix-op" value = "Mr" > Mr</option>
          <option class = "prefix-op" value = "Ms"> Ms</option>
          <option class = "prefix-op" value = "Mrs"> Mrs</option>
        </select>
        <input class = "input-box" type = "text" placeholder="First Name" id = "pass-fname">
        <input class = "input-box" type = "text"  placeholder="Last Name" id = "pass-lname">
        <label class = "date-label" for= "pass-dob">
          Birthdate
        </label>
        <input class = "input-box"  type = "date" placeholder = "mm-dd-yyyy" id = "pass-dob" >
      </div>
    
      <div class = "btm">
        <input class = "input-box" type = "text" placeholder="Identification Number" id = "id-num">
        <input class = "input-box" type = "text" placeholder="Country of Issue" id = "nationality">
        <label class = "date-label" for="id-exp">Expiration Date</label>
        <input class = "input-box"  type = "date" placeholder = "mm-dd-yyyy" id = "id-exp" > 
      </div>
    </div> `;

    }
    pass_container.innerHTML = temp_container;

    //payment container 
    const pay_table = document.querySelector(".price-table");
    pay_table.querySelector("#price_pc").innerHTML = `+ $${tick_price}`;
    pay_table.querySelector("#tax").innerHTML = `+ $${tax*100}%`;
    pay_table.querySelector("#discount").innerHTML = `- $${discounts}`;
    pay_table.querySelector("#total").innerHTML = `$${calc_total(no_tick, discounts)}`;

}