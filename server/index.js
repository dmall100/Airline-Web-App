const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const fs = require('fs');
/*fs.writeFile('../../query.sql/', '', function() { console.log('query.sql cleaned and ready') });
fs.writeFile('../../transaction.sql/', '', function() { console.log('transaction.sql cleaned and ready') });*/
const transactions = require('./transaction');
const query = require('./query');
let index = 2; 
var async = require('async');
const { response } = require('express');
const inc_index = () => {
    index = index + 1;
}

// middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES

//Get world list 
app.get('/world_list', async(req, res) => {
    try {
        const world_list = await pool.query(`
        SELECT * FROM location;`);
        console.log(world_list.rows);
        res.json(world_list.rows);
    } catch (err) {
        console.log(err.message);
    }
});

//get all flightss
app.get('/flights', async(req, res) => {
    try {
        const no_ticket = req.body;
        const avflight = await pool.query(query.queryGetFlights);
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});

//get flights depending on availability 
app.get('/trips/:id', async(req, res) => {
    try {
        const { id } = req.params;
        let avflight = await pool.query(query.queryGetTrips1, [id]);
        console.log(avflight.rows); 
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});

//get flights depending on availability 
app.get('/flights/:id', async(req, res) => {
    try {
        const { id } = req.params;
        let avflight =  await pool.query(query.GetOneWay, [id]); 
        console.log(avflight.rows); 
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});


app.get('/flights/:id/:d_city-:a_city/', async(req, res) => {
    try {
        const { id } = req.params;
        const { a_city } = req.params;
        const { d_city } = req.params;

        const avflight = await pool.query(query.queryGetTrip, [id, d_city, a_city]);

        console.log(avflight.rows);
        res.json(avflight.rows);

    } catch (err) {
        console.log(err.message);
    }
});


function Generate_book_ref() {
    inc_index();
    book_ref = ""
    for (var i = 0; i < (6 - index.length); i++)
        book_ref = book_ref + "0";
    book_ref = book_ref + JSON.stringify(index);
    return book_ref
}

function generate_ticket(pass_id, trip_no) {
    return "TR" + trip_no + pass_id.substr(pass_id.length - 4);
}


const InsertPass = async(passgs) => {
    for (pass of passgs) {
        const ans = await pool.query(transactions.queryInsertPass, [pass.id_no, pass.prefix + pass.fname + pass.lname, new Date(pass_id.DOB), pass.nation]);
        if (ans.length != 0) {
            return ans;
        }
    }
}

app.post('/booking', async(req, res) => {
    try {
        let pars = req.body;
        let book_ref = Generate_book_ref();
        const no_ticket = pars.no_ticket;
        const trip_no = pars.trip_no; 
        const flight = await pool.query(`SELECT * FROM trips WHERE trip_no = $1`, [trip_no]); 
        const flights = flight.rows; 
        console.log(pars.pass.length);
        const response = await pool.query("START TRANSACTION")
            .then((res) => {
                return pool.query(transactions.queryInsertBook, [book_ref, new Date(), no_ticket, pars.cont.ctname, pars.cont.ct_nom, pars.cont.ct_email]);
            })
            .then(async(res) => {
                let ans = "";
                for (pass of pars.pass) {
                    ans += await pool.query(transactions.queryInsertPass, [pass.id_no, pass.prefix + pass.fname + pass.lname, pass.DOB, pass.nation]);
                    let ticket_no = generate_ticket(pass.id_no, trip_no);
                    ans += await pool.query(transactions.queryInsertTick, [ticket_no, book_ref, pass.id_no, trip_no]);

                }
                return ans;

            })
            .then((res) => {
                return pool.query(transactions.queryInsertPay, [book_ref, 700, no_ticket, pars.pay.c_nom, 0]);
            })
            .then(async(res) => {
                let ans = await pool.query(transactions.queryUpdateAS, [flights[0].flight_id1]);
                console.log("ans:"+ans+ "  " +flights[0].flight_id1); 
                if(flights[0].flight_id2 != ""){
                    ans += await pool.query(transactions.queryUpdateAS, [flights[0].flight_id2]);
                }
                return ans;
            })
            .then((res) => {
                console.log("commited")
                pool.query("commit")
                return book_ref;

            })
            .catch((err) => {
                console.log("rolledback " + err.message)
                pool.query("rollback")
                return "";
            });

        res.json(response);
    } catch (err) {
        console.log(err.message);
    }
});

//get all flights
app.get('/list_flights', async(req, res) => {
    try {
        const getflights = await pool.query(`SELECT * FROM flights WHERE seats_available > 0 ORDER BY flight_id;`);
        res.json(getflights.rows);

        // Write to query.sql
        /*var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`SELECT * FROM flights WHERE seats_available > 0 ORDER BY flight_id;\n`);
        stream.end();*/
    } catch (err) {
        console.log(err.message);
    }
});

//get all passengers on a flight
app.get('/list_flights/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const getpassengers = await pool.query(`
            SELECT passenger_name, seat_no 
            FROM ticket a 
            NATURAL JOIN 
            boarding_passes b 
            NATURAL JOIN 
            flights c 
            WHERE b.flight_id=${id};
            `);
        res.json(getpassengers.rows);

        // Write to query.sql
        /*var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`
            SELECT passenger_name, seat_no 
            FROM ticket a 
            NATURAL JOIN 
            boarding_passes b 
            NATURAL JOIN 
            flights c 
            WHERE b.flight_id=${id};\n
        `);
        stream.end();*/
    } catch (err) {
        console.log(err.message);
    }
});


//get boarding pass
app.get('/check_in/:num', async(req, res) => {
    try {
        const { num } = req.params;
        const getPassTick = await pool.query(`
            SELECT * 
            FROM ticket T
            JOIN 
            passenger P 
            ON P.passenger_id = T.passenger_id
            WHERE ticket_no = '${num}';
        `);
        res.json(getPassTick.rows);

        // Write to query.sql
        /*var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`
        SELECT * 
        FROM boarding_passes 
        WHERE ticket_no = '${num}';\n
        `);
        stream.end();*/
    } catch (err) {
        console.log(err.message);
    }
});

// add flight.
app.post('/admin_add_flight', async(req, res) => {
    try {
        const {
            flight_id,
            flight_no,
            dep_time,
            arr_time,
            dep_airport,
            arr_airport,
            flight_status,
            aircraft_code,
            seats_avail,
            seats_booked
        } = req.body;

        // Transaction to insert flight to db.
        await pool.query(`START TRANSACTION`)
        const newFlight = await pool.query(`INSERT INTO flights VALUES(
            ${flight_id}, 
            '${flight_no}', 
            '${dep_time}', 
            '${arr_time}', 
            '${dep_airport}', 
            '${arr_airport}', 
            '${flight_status}', 
            '${aircraft_code}', 
            ${seats_avail}, 
            ${seats_booked}) returning *`);
        await pool.query(`COMMIT`)

        const newFlight1 = await pool.query(`INSERT INTO trips VALUES(
            ${flight_id}, 
            NULL) returning *`);
        await pool.query(`COMMIT`)

        res.json(newFlight);
        console.log("committed");

        // Write to transaction.sql
        /*var stream = fs.createWriteStream("../../transaction.sql/", { flags: 'a' });
        stream.write(`START TRANSACTION; \nINSERT INTO flights VALUES(
            ${flight_id}, 
            '${flight_no}', 
            '${dep_time}', 
            '${arr_time}', 
            '${dep_airport}', 
            '${arr_airport}', 
            '${flight_status}', 
            '${aircraft_code}', 
            ${seats_avail}, 
            ${seats_booked}) returning *;\nCOMMIT;\n`);
        stream.end();*/
    } catch (err) {
        // Rollback if incorrect input is given.
        await pool.query(`ROLLBACK`)
        res.json(0);
        console.log(err.message);
    }
});

//get payment
app.get('/admin_payment/:ref', async(req, res) => {
    try {
        const { ref } = req.params;
        const getpayment = await pool.query(`
        SELECT book_ref, amount_per_tick, num_tickets, discount
        FROM payment a 
        NATURAL JOIN 
        bookings b 
        WHERE a.book_ref='${ref}';
        `);
        res.json(getpayment.rows);

        // Write to query.sql
        /*var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`SELECT book_ref, amount_per_tick, num_tickets, discount, total amount 
        FROM payment a 
        NATURAL JOIN 
        bookings b 
        WHERE a.book_ref='${ref}';\n`);
        stream.end();*/
    } catch (err) {
        console.log(err.message);
    }
});

// set up the server listening at port 5000 (the port number can be changed)
// PORT
const port = process.env.PORT || 1385;
app.listen(port, () => console.log(`Listening on port ${port}...`));
