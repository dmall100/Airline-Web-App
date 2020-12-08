const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

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
        console.log(getpassengers.rows);
        res.json(getpassengers.rows);
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
    } catch (err) {
        console.log('here');
        console.log(err.message);
    }
});

// set up the server listening at port 5000 (the port number can be changed)
// PORT
const port = process.env.PORT || 1385;
app.listen(port, () => console.log(`Listening on port ${port}...`));