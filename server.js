"use strict";

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const pg = require("pg");

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL,  ssl: { rejectUnauthorized: false } });

// client.connect()

app.get("/", homeHandler);
app.get('/people',getPeopleHandler);
app.post('/people',createPeopleHandler);
app.put('/people',updatePeopleHandler);
app.delete('/people',deletePeopleHandler);

function homeHandler(req, res) {
  res.status(200).send("all good");
}

function getPeopleHandler(req,res) {
    let SQL = 'select * from person'; 
    client.query(SQL).then(results => {
        res.status(200).send(results.rows)
    }).catch(error=>{
        console.log(error);
    })
}


// localhost:3001/people (body>>{'first':'razan','last':'quran'})
function createPeopleHandler(req,res) {
    let first = req.body.first;
    let last = req.body.last;
    let SQL = 'INSERT INTO person (firstname,lastname) VALUES ($1,$2) RETURNING *';
    let safeValues = [first,last]
    client.query(SQL,safeValues).then(results=>{
        res.status(200).send(results.rows);
    })
}


// localhost:3001/people?first=noor
function updatePeopleHandler(req,res) {
    let first = req.query.first;
    let SQL = `UPDATE person SET firstname=$1 WHERE lastname='quran'`;
    let safeValues = [first];

    client
    .query(SQL,safeValues)
    .then(()=>{
        res.send('data has been updated')
    })

}

// localhost:3001/people?first=karen
function deletePeopleHandler(req,res) {
    let first = req.query.first;
    let safeValues = [first];
    let SQL = `DELETE FROM person WHERE firstname=$1`;
    client.query(SQL,safeValues).then(()=>{
        res.send('data has been deleted')
    })
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
