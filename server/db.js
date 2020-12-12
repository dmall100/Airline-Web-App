// CREATE TABLE todo(
//   todo_id SERIAL PRIMARY KEY,
//   description VARCHAR(255)  
// );
// only two attributes in the table: todo_id and description
const Pool = require('pg').Pool;
const fs = require('fs'); 
const text = fs.readFileSync("./password.txt").toString('utf-8'); 
var textByLine = text.split("\n"); 
const pool = new Pool({
  host: 'code.cs.uh.edu',
  user: textByLine[0].trim(),
  password: textByLine[1],
  port: 5432,
  database: 'COSC3380'
});

module.exports = pool;