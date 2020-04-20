// Variables de configuración
const express = require('express');
const { Client } = require('pg');
const bodyParser = require("body-parser");
require("dotenv/config");
const app = express();

var PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar conexión
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
  
client.connect( () =>{
    console.log('Connected');
});

// Redireccionar siempre
app.get('/', (req, res) => {
  console.log('Redirecting...');
  res.redirect('/cases');
});

// Queries - Case
app.get('/cases', (req, res)=>{
    client.query('SELECT * FROM salesforce.case ORDER BY id DESC', (err, data)=>{
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(data.rows);
      }
    });
});

app.get('/cases/:id', (req, res)=>{
  client.query('SELECT * FROM salesforce.case WHERE id = $1', [req.params.id], (err, data)=>{
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } 
    else {
      res.json(data.rows[0]);
    }
  });
});

// Queries - Notification__c
app.post('/notifications', (req, res) => {
  client.query("INSERT INTO " +
    "salesforce.case(details__c, instance_id__c, category__c, type__c, eventid__c, status__c, issue_name__c, cisco_dna_link__c, priority__c, domain__c)" +
    "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    
    [req.body.details["Assurance Issue Details"], req.body.instanceId, req.body.category, 
    req.body.type, req.body.eventId, req.body.details["Assurance Issue Status"], req.body.details["Assurance Issue Name"], 
    req.body.ciscoDnaEventLink, req.body.details["Assurance Issue Priority"], req.body.domain],

    (err, data) => {
      if(err){
        console.log('Error:', err);
        res.status(400).send(err);
      }
      else {
        console.log('Success. Inserting into database.');
        res.send(data.rows[0]);
      }
    });
});

// Inicializar
app.listen(PORT, () => {
    console.log("Listening on PORT:", PORT);
});