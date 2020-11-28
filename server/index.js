const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
                           
// middleware
app.use(cors());
app.use(express.json());      //req.body

//ROUTES



//get all todo
app.get('/avflights', async(req, res)=>{
  try{
    const avflight = await pool.query(`SELECT * FROM trial`);
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});


// set up the server listening at port 5000 (the port number can be changed)
app.listen(1385, ()=>{
  console.log("server has started on port 1385");
});