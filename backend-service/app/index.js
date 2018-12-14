'use strict';
  
const express = require('express');
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
const db = require('./libs/db.js');
var bodyParser = require('body-parser');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get('/countries', (req, res) => {
    db.getCountries((err, response)=>{
        if(err) {
          console.log('Errored while retrieving countries');
          return res.send(err);
        }
        res.send(response);
    });
});

app.get('/cities', (req, res) => {
    db.getCities(req.query, (err, response)=>{
        if(err) {
          console.log('Errored while retrieving cities for ', req.query);
          return res.send(err);
        }
        res.send(response);
    });
});

app.post('/users', (req, res) => {
    db.addUser(req.body, (err, response)=>{
        if(err) {
          console.log('Errored while adding user ', req.query);
          return res.send(err);
        }
        res.send(response);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
