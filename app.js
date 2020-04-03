// Variables de configuración
const express = require('express');
const { Client } = require('pg');
const bodyParser = require("body-parser");
require("dotenv/config");
const app = express();

var PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar conexión, middlewares y rutas
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
  
client.connect( () =>{
    console.log('Connected');
});

// Queries - Case
app.get('/cases', (req, res)=>{
    client.query('SELECT * FROM salesforce.case', (err, data)=>{
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(data.rows);
      }
    });
});

// Queries - Notification__c
app.get('/notifications', (req, res)=>{
  client.query('SELECT * FROM salesforce.notification__c', (err, data)=>{
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(data.rows);
    }
  });
});

// Inicializar
app.listen(PORT, () => {
    console.log("Listening on PORT:", PORT);
});