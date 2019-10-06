//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const assert = require('assert');
//import peerjs library
//const peer = require('peer');
//const URI = process.env.MONGODB_URI;
const URI = 'mongodb://<dbuser>:<dbpassword>@ds261616.mlab.com:61616/heroku_xr0pdhrx';
const MongoClient = require('mongodb').MongoClient;

//set up db connection on startup
MongoClient.connect(URI, function(err, client) {
	assert.equal(null, err);
	console.log('Connected to DB');

	const db = client.db('heroku_xr0pdhrx');
})
//establish variables for db
const OpenChats = db.collection('OpenChats');
const Users = db.collection('Users');


const app = express();

const SERVER = app.listen(PORT, ()=> console.log(`I'm listening on port ${PORT}`));

//initial placeholder route
app.get('/', (req, res)=>{
	res.status(200);
	res.send("This is a placeholder!");
})

//return a list of all open chats in the db
app.get('/getOpenChats', (req, res)=>{
	res.status(200);
	OpenChats.find({}).toArray(function(err, chats) {
		assert.equal(err, null);
		console.log(`Current chats open: ${chats}`);
	})


})

const peerServerOptions = {
	debug: false,
}
const peerServer =  require('peer').ExpressPeerServer(SERVER, peerServerOptions);

app.use('/peerjs', peerServer);


peerServer.on('connection', (client) => {
	console.log('Connection established from ', client);
	Users.insert({UserID: client.id}, function(err, results) {
		console.log('client ID added to Users collection');
	});
})
peerServer.on('disconnect', (client) => {
	console.log('Disconnection from ', client);
	Users.deleteOne({UserID: client.id}, function(err, results) {
		console.log('User document removed');
	});
})