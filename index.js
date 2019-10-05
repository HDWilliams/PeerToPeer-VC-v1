//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');

//import peerjs library
//const peer = require('peer');

const Mongo = require('mongodb');
const URI = process.env.MONGODB_URI;

const app = express();

const SERVER = app.listen(PORT, ()=> console.log(`I'm listening on port ${PORT}`));

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

const peerServerOptions = {
	debug: false,
}
const peerServer =  require('peer').ExpressPeerServer(SERVER, peerServerOptions);

app.use('/peerjs', peerServer);


peerServer.on('connection', (client) => {
	console.log('Connection established from ', client);
})