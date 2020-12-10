const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const fs = require('fs');
fs.writeFile('../../query.sql/', '', function() { console.log('query.sql cleaned and ready') });
fs.writeFile('../../transaction.sql/', '', function() { console.log('transaction.sql cleaned and ready') });

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

//get all flights
app.get('/flights', async(req, res) => {
    try {
        console.log("HERE");
        const avflight = await pool.query(`
            SELECT *, A.city AS arrival_city, D.city AS departure_city 
            FROM flights AS F
            INNER JOIN 
            airport AS D
            on F.departure_airport = D.airport_code
            INNER JOIN 
            airport As A
            on arrival_airport = A.airport_code;
        `);
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});

//get flights depending on availability 
app.get('/flights/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const avflight = await pool.query(`
            SELECT *, lD.city as departure_city, lA.city as arrival_city
            FROM 
            (
              SELECT *, A.city_id AS a_city_id, D.city_id AS d_city_id 
              FROM flights AS F
              INNER JOIN 
              airport AS D
              on F.departure_airport = D.airport_code
              INNER JOIN
              airport As A
              on arrival_airport = A.airport_code
            ) B
            INNER JOIN 
            location AS lD
            on B.d_city_id = lD.city_id
            INNER JOIN 
            location AS lA
            on B.a_city_id = lA.city_id
            WHERE seats_available >= $1;`, [id]);
        console.log(avflight.rows);
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/flights/:id/:a_city', async(req, res) => {
    try {
        const { id } = req.params;
        const { a_city } = req.params;
        const avflight = await pool.query(`
            SELECT * 
            FROM(
              SELECT *, lD.city as departure_city, lA.city as arrival_city
            FROM 
            (
              SELECT *, A.city_id AS a_city_id, D.city_id AS d_city_id 
              FROM flights AS F
              INNER JOIN 
              airport AS D
              on F.departure_airport = D.airport_code
              INNER JOIN
              airport As A
              on arrival_airport = A.airport_code
            ) B
            INNER JOIN 
            location AS lD
            on B.d_city_id = lD.city_id
            INNER JOIN 
            location AS lA
            on B.a_city_id = lA.city_id
            WHERE seats_available >= $1
            ) AS F
            WHERE a_city_id = $2;`, [id, a_city]);
        console.log(avflight.rows);
        res.json(avflight.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.post('/flights', async(req, res) => {
    try {
        const { name } = req.body;
        const newTodo = await pool.query(`INSERT INTO booking (name) VALUES($1) returning *`, [name]);
        //console.log(newTodo)
        res.json(newTodo);
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
        var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`SELECT * FROM flights WHERE seats_available > 0 ORDER BY flight_id;\n`);
        stream.end();
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
        var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`
            SELECT passenger_name, seat_no 
            FROM ticket a 
            NATURAL JOIN 
            boarding_passes b 
            NATURAL JOIN 
            flights c 
            WHERE b.flight_id=${id};\n
        `);
        stream.end();
    } catch (err) {
        console.log(err.message);
    }
});


//get boarding pass
app.get('/check_in/:num', async(req, res) => {
    try {
        const { num } = req.params;
        const getboardingpass = await pool.query(`
            SELECT * 
            FROM boarding_passes 
            WHERE ticket_no = '${num}';
        `);
        res.json(getboardingpass.rows);

        // Write to query.sql
        var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`
        SELECT * 
        FROM boarding_passes 
        WHERE ticket_no = '${num}';\n
        `);
        stream.end();
    } catch (err) {
        console.log(err.message);
    }
});

// add flight
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

        res.json(newFlight);
        console.log("committed");

        // Write to transaction.sql
        var stream = fs.createWriteStream("../../transaction.sql/", { flags: 'a' });
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
        stream.end();
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
        SELECT book_ref, amount_per_tick, num_tickets, discount, total_amount 
        FROM payment a 
        NATURAL JOIN 
        bookings b 
        WHERE a.book_ref='${ref}';
        `);
        res.json(getpayment.rows);

        // Write to query.sql
        var stream = fs.createWriteStream("../../query.sql/", { flags: 'a' });
        stream.write(`SELECT book_ref, amount_per_tick, num_tickets, discount, total amount 
        FROM payment a 
        NATURAL JOIN 
        bookings b 
        WHERE a.book_ref='${ref}';\n`);
        stream.end();
    } catch (err) {
        console.log(err.message);
    }
});

// set up the server listening at port 5000 (the port number can be changed)
// PORT
const port = process.env.PORT || 1385;
app.listen(port, () => console.log(`Listening on port ${port}...`));