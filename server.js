// To deploy to Azure: https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs

// importing libraries 
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// Brings in information that shouldn't be shared
require('dotenv').config();

// creates the connection between the server and the database
const config = {
  host: process.env.DATABASE_URL,
  user: process.env.USER_NAME,     
  password:  process.env.PASSWORD,
  database:  'postgres',
  port:  5432,
  ssl: true,
};

const database = new pg.Client(config);

database.connect(err => {
  if (err) throw err;
  else { queryDatabase(); }
});

function queryDatabase() {
  const query = 
      // WILL CLEAR EVERYTHING ON DEPLOYMENT!
      `DROP TABLE recipes;
      CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      ingredients TEXT UNIQUE
    );`
  ;

  database
      .query(query)
      .then(() => {
          console.log('Table created successfully!');
      })
      .catch(err => console.log(err))
      .then(() => {
          console.log('Finished execution, exiting now');
      });
}

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Used to retrieve data from POST requests
// https://stackoverflow.com/questions/38294730/express-js-post-req-body-empty
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// 1st param -Path
// 2nd param -Function
app.get('/', test);
app.get('/recipes', getRecipes);
app.get('/list', createList);
app.post('/save', saveRecipe);
app.post('/delete', deleteItems);

// request: all the 'stuff' we're sending to the server
// response: all the 'stuff' we're sending back to the user
// client: who is making the request
// server: who is responding to the request
function test(request, response) {
    response.send("Hello World!");
}

function getRecipes(request, response) {
    console.log(request.query.food);
    const url = `http://www.recipepuppy.com/api/?q=${request.query.food}`;

    superagent.get(url)
    .then(result => {
      const data = JSON.parse(result.text);
      response.send(data.results);
    })
    .catch(error => console.error(error));
}

function saveRecipe(request, response) {
  console.log(request.body);
  const SQL = `INSERT INTO recipes (ingredients) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id;`;
  const inArr = request.body.ingredients.split(", ");
  inArr.forEach(ingredient => {
    database.query(SQL, [ingredient])
      .then(result => {
        response.send({"info" : result.rows[0].id});
      })
      .catch(error => console.error(error));
  })
}

function createList(request, response) {
  const SQL = `SELECT * FROM recipes;`;
  database.query(SQL)
    .then(result => {
      console.log(result.rows);
      response.send(result.rows);
    })
  .catch(error => console.error(error));
}

function deleteItems(request, response) {
  const SQL = `DELETE FROM recipes WHERE id=$1;`;
  request.body.ids.forEach(id => {
    database.query(SQL, [id])
      .then(result => {
        response.send({"info" : "deleted items"});
      })
      .catch(error => console.error(error));  
  });  
}

// Starts server, always at end of file
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));