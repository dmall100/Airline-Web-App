const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
                           
// middleware
app.use(cors());
app.use(express.json());      //req.body

//ROUTES
//Get world list 
app.get('/world_list', async(req, res)=>{
  try{
    const world_list = await pool.query(`
      SELECT * FROM location;`
     );
    console.log(world_list.rows);
    res.json(world_list.rows);
  } catch(err){
    console.log(err.message);
  }
});

//get all flights
app.get('/flights', async(req, res)=>{
  try{
    console.log("HERE");
    const no_ticket = req.body; 
    console.log("no is");
    const avflight = await pool.query(`SELECT *, lD.city as departure_city, lA.city as arrival_city
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
      on B.a_city_id = lA.city_id`
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
        WHERE seats_available >= $1;`, [id]
    );
    console.log(avflight.rows);
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});
app.get('/flights/:id/:d_city-:a_city', async(req, res)=>{
  try{
    console.log(`Hello`)
    const {id} = req.params; 
    const {a_city} = req.params; 
    const {d_city} = req.params; 
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
    WHERE F.a_city_id = $2 and F.d_city_id = $3;`, [id,a_city, d_city]);
    console.log(avflight.rows);
    res.json( avflight.rows);

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
app.listen(1585, ()=>{
  console.log("server has started on port 1485");
});