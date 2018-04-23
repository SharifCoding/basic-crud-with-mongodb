/* eslint prefer-destructuring: 0 */
// IMPORT EXPRESS
const express = require('express');

// INSTANTIATE APP
const app = express();

// IMPORT BODY-PARSER
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// IMPORT MONGODB
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// MLAB CONNECTION STRING
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, './settings.env'),
});

// GET REQUEST - HTTP MESSAGE `localhost:3000`
app.get('/', (req, res) => {
  res.send('Its working!');
});
// GET REQUEST - HTTP MESSAGE `localhost:3000/extra`
app.get('/extra', (req, res) => {
  res.send('Additional message, Its working!');
});

// CONNECTION TO MONGOCLIENT INSTANCE
MongoClient.connect(process.env.DATABASE_CONN, (err, db) => {
  const dbase = db.db('basic-crud');
  if (err) return console.log(err);

  // EXPRESS LISTEN SERVER
  app.listen(3000, () => {
    console.log('basic CRUD app listening on 3000...');
  });

  // POST ROUTE - CREATING AN ENTRY
  app.post('/name/add', (request, response, next) => {
    const name = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
    };
    dbase.collection('name').save(name, (err, result) => {
      if (err) {
        console.log(err);
      }
      response.send('name added successfully');
    });
  });

  // GET ROUTE - READING ALL ENTRIES
  app.get('/name', (request, response) => {
    dbase.collection('name').find().toArray((err, result) => {
      response.send(result);
    });
  });
  return true; // disable eslint error (consistent-return)
});
