//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');

//import peerjs library
//import Peer from 'peerjs';

const Mongo = require('mongodb');
const URI = process.env.MONGODB_URI;

const app = express();

//initial placeholder route
app.get('/', (req, res)=>{
	res.status(200);
	res.send("This is a placeholder!");
})

app.get('/newchat', (req, res)=>{
	//const peer = new Peer();
	res.status(200);
	res.send(`Your Id is `);

})

app.listen(PORT, ()=> console.log(`I'm listening on port ${PORT}`));



