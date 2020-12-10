// Insert new flight into the database.

// insert a new flight
async function insertFlight() {
    // read the flight details from the input
    const flight_id = document.querySelector('#flight-id').value;
    const flight_no = document.querySelector('#flight-number').value;
    const dep_time = document.querySelector('#departure-time').value;
    const arr_time = document.querySelector('#arrival-time').value;
    const dep_airport = document.querySelector('#departure-airport').value;
    const arr_airport = document.querySelector('#arrival-airport').value;
    const flight_status = document.querySelector('#flight-status').value;
    const aircraft_code = document.querySelector('#aircraft-code').value;
    const seats_avail = document.querySelector('#seats-available').value;
    const seats_booked = document.querySelector('#seats-booked').value;

    // use try... catch... to catch error
    try {

        // insert new flight to "http://localhost:1385/admin_add_flight", with "POST" method
        const body = {
            flight_id: flight_id,
            flight_no: flight_no,
            dep_time: dep_time,
            arr_time: arr_time,
            dep_airport: dep_airport,
            arr_airport: arr_airport,
            flight_status: flight_status,
            aircraft_code: aircraft_code,
            seats_avail: seats_avail,
            seats_booked: seats_booked
        };

        const response = await fetch("http://localhost:1385/admin_add_flight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const jsonData = await response.json();

        // Success / Failure here
        if (Object.keys(jsonData).length > 0) {
            document.getElementById("success-display").style.display = "block";
            document.getElementById("error-display").style.display = "none";
        } else {
            document.getElementById("success-display").style.display = "none";
            document.getElementById("error-display").style.display = "block";
        }
    } catch (err) {
        console.log(err.message);
    }
}