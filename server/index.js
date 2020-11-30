const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
                           
// middleware
app.use(cors());
app.use(express.json());      //req.body

//ROUTES



//get all todo
app.get('/flights', async(req, res)=>{
  try{
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
    //console.log(avflight.rows);
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});

app.post('/flights', async(req,res)=>{
  try{
    const {name} = req.body;
    const newTodo = await pool.query(`INSERT INTO booking (name) VALUES($1) returning *`,[name]);
    //console.log(newTodo)
    res.json(newTodo);  
  }catch(err){
    console.log(err.message);
  }

});

//get all flights
app.get('/list_flights', async(req, res)=>{
  try{
    const getflights = await pool.query(`SELECT * FROM flights WHERE seats_available > 0 ORDER BY flight_id`);
    res.json(getflights.rows);
  } catch(err){
    console.log(err.message);
  }
});

//get all passengers on a flight
app.get('/list_flights/:id', async(req, res)=>{
  try{
    const { id } = req.params;
    const getpassengers = await pool.query(`
    SELECT passenger_name, seat_no 
    FROM ticket a 
    NATURAL JOIN 
    boarding_passes b 
    NATURAL JOIN 
    flights c 
    WHERE b.flight_id=${id}
    `);
    console.log(getpassengers.rows);
    res.json(getpassengers.rows);
  } catch(err){
    console.log(err.message);
  }
});

// set up the server listening at port 5000 (the port number can be changed)
// PORT
const port = process.env.PORT || 1385;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));