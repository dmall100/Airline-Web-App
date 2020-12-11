const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const transactions = require('./transaction'); 
const query = require('./query'); 
let index = 0; 
const fs = require('fs');

fs.writeFile('../../query.sql/', '', function() { console.log('query.sql cleaned and ready') });
fs.writeFile('../../transaction.sql/', '', function() { console.log('transaction.sql cleaned and ready') });

const inc_index = () => {
  index = index + 1;
}
                           
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

//get all flightss
app.get('/flights', async(req, res)=>{
  try{
    const no_ticket = req.body; 
    const avflight = await pool.query(query.queryGetFlights); 
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});

//get flights depending on availability 
app.get('/flights/:id', async(req, res)=>{
  try{
    const {id} = req.params; 
    let avflight = await pool.query(query.queryGetTrips1, [id]);
    avflight 
    console.log(avflight.rows)
    res.json(avflight.rows);
  } catch(err){
    console.log(err.message);
  }
});
app.get('/flights/:id/:d_city-:a_city/', async(req, res)=>{
  try{
    const {id} = req.params; 
    const {a_city} = req.params; 
    const {d_city} = req.params;

    const avflight = await pool.query(query.queryGetTrip, [id,d_city, a_city]);
    
    console.log(avflight.rows);
    res.json( avflight.rows);

  } catch(err){
    console.log(err.message);
  }
});


function Generate_book_ref(){
  inc_index(); 
  book_ref = ""
  for (var i = 0; i < (6-index.length); i++)
      book_ref = book_ref + "0";
  book_ref = book_ref + JSON.stringify(index);
  return book_ref
}

function generate_ticket(pass_id, trip_no){
  return trip_no + pass_id.substr(pass_id.length-4); 
}


const InsertPass = async(passgs) =>  {
  for(pass of passgs){
    const ans = await pool.query(transactions.queryInsertPass, [pass.id_no, pass.prefix + pass.fname + pass.lname, new Date(12/9/1997), pass.nation]); 
    if(ans.length != 0){
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
    console.log(pars.pass.length); 
    let flights = [{flight_id: 1001}, {flight_id: 1002}]; 
    pars.pass.forEach(element => {
      console.log("hi:" + element.id_no); 
    });
    const response = await pool.query("START TRANSACTION")
    .then((res) => {
      return pool.query(transactions.queryInsertBook, [book_ref, new Date(), no_ticket, pars.cont.ctname, pars.cont.ct_nom, pars.cont.ct_email]);
    })
    .then(async(res) => {
      let ans = "";
      for(pass of pars.pass){
        ans += await pool.query(transactions.queryInsertPass, [pass.id_no, pass.prefix + pass.fname + pass.lname, new Date(12/9/1997), pass.nation]); 
        let ticket_no = generate_ticket(pass.id_no);
        ans +=  await pool.query(transactions.queryInsertTick, [ticket_no, book_ref, pass.id_no, trip_no]);
        
      }
      return ans; 

    })
    .then((res) => {
      return pool.query(transactions.queryInsertPay, [book_ref, 700, no_ticket, pars.pay.c_nom,0]); 
    })
    .then(async(res) => {
      let ans = "";
      for(flight of flights){
        ans +=  await pool.query(transactions.queryUpdateAS, [flight.flight_id]);
      }
      return ans; 
    })
    .then((res) => {
      console.log("commited")
      pool.query("commit")
      return "success"; 

    })
    .catch((err) => {
      console.log("rolledback " + err.message)
      pool.query("rollback")
      return err.message;
    });

   res.json(response); 
  }catch (err) {
    console.log(err.message); 
  }
});

// set up the server listening at port 5000 (the port number can be changed)
app.listen(1585, ()=>{
  console.log("server has started on port 1485");
});