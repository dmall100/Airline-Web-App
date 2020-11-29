const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
                           
// middleware
app.use(cors());
app.use(express.json());      //req.body

//ROUTES



//get all flights
app.get('/flights', async(req, res)=>{
  try{
    console.log("HERE");
    const no_ticket = req.body; 
    console.log("no is");
    const avflight = await pool.query(`
      SELECT *, A.city AS arrival_city, D.city AS departure_city 
      FROM flights AS F
      INNER JOIN 
      airport AS D
      on F.departure_airport = D.airport_code
      INNER JOIN
      airport As A
      on arrival_airport = A.airport_code`
     );
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});

//get flights depending on availability 
app.get('/flights/:id', async(req, res)=>{
  try{
    const {id} = req.params; 
    const avflight = await pool.query(`
        SELECT *, A.city AS arrival_city, D.city AS departure_city 
        FROM flights AS F
        INNER JOIN 
        airport AS D
        on F.departure_airport = D.airport_code
        INNER JOIN
        airport As A
        on arrival_airport = A.airport_code
        WHERE seats_available >= $1;`, [id]

    );
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});

app.post('/flights', async(req,res)=>{
  try{
    const {name} = req.body;
    const newTodo = await pool.query(`INSERT INTO booking (name) VALUES($1) returning *`,[name]);
    console.log(newTodo)
    res.json(newTodo);  
  }catch(err){
    console.log(err.message);
  }

});

// set up the server listening at port 5000 (the port number can be changed)
app.listen(1385, ()=>{
  console.log("server has started on port 1385");
});