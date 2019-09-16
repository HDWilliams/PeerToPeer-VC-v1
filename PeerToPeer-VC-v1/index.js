//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');

const Mongo = require('mongodb');
const URI = process.env.MONGODB_URI;

const app = express()

//initial placeholder route
app.get('/', (req, res)=>{
	res.send("This is a placeholder!");
})

app.listen(PORT, console.log(`I'm listening on port ${PORT}`));



