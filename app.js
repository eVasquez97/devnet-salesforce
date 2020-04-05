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
  res.redirect('/notifications');
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
app.get('/notifications', (req, res)=>{
  client.query('SELECT * FROM salesforce.notification__c ORDER BY id DESC', (err, data)=>{
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(data.rows);
    }
  });
});

app.get('/notifications/:id', (req, res)=>{
  client.query('SELECT * FROM salesforce.notification__c WHERE id = $1', [req.params.id], (err, data)=>{
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(data.rows[0]);
    }
  });
});

app.post('/notifications', (req, res) => {
  client.query("INSERT INTO " +
    "salesforce.notification__c(details__c, instance_id__c, category__c, type__c, eventid__c, status__c, issue_name__c, cisco_dna_link__c, priority__c, domain__c)" +
    "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    
    [req.body.details__c, req.body.instance_id__c, req.body.category__c, req.body.type__c, req.body.eventid__c, req.body.status__c, req.body.issue_name__c, 
    req.body.cisco_dna_link__c, req.body.priority__c, req.body.domain__c],

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