//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const assert = require('assert');
//import peerjs library
//const URI = process.env.MONGODB_URI;
//testing locally only
const URI = 'mongodb://heroku_xr0pdhrx:2nv9q54oe2iaa9hjv7csdbig74@ds261616.mlab.com:61616/heroku_xr0pdhrx';

console.log(process.env);
const MongoClient = require('mongodb').MongoClient;

//set up db connection on startup
// const db = MongoClient.connect(URI, function(err, client) {
// 	assert.equal(null, err);
// 	console.log('Connected to DB');
// 	return client.db('heroku_xr0pdhrx');
// })
let db = MongoClient.connect(process.env.MONGODB_URI, function (error, client) {
  assert.equal(null, error);
  console.log('connected to db');
  console.log(client);
  db = client.db('heroku_xr0pdhrx');
});

//establish variables for db
// const OpenChats = db.collection('OpenChats');
// const Users = db.collection('Users');


const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const SERVER = app.listen(PORT, ()=> console.log(`I'm listening on port ${PORT}`));

//initial placeholder route
app.get('/', (req, res)=>{
	res.status(200);
	res.send("This is a placeholder!");
})

//return a list of all open chats in the db. Needs to be set up with routing before use
app.get('/getOpenChats', (req, res)=>{
	res.status(200);
	db.collection('OpenChats', function(error, coll) {
		coll.find({}).toArray(function(err, chats) {
			assert.equal(err, null);
			res.send(chats);
		})
	});
})

const peerServerOptions = {
	debug: false,
}
const peerServer =  require('peer').ExpressPeerServer(SERVER, peerServerOptions);

app.use('/peerjs', peerServer);


peerServer.on('connection', (client) => {
	console.log('Connection established from ', client);
	db.collection('Users', function(error, coll) {
		coll.insert({UserID: client}, function(err, results) {
			console.log('client ID added to Users collection');
		});
	});
	// Users.insert({UserID: client}, function(err, results) {
	// 	console.log('client ID added to Users collection');
	// });
})
peerServer.on('disconnect', (client) => {
	console.log('Disconnection from ', client);
	// Users.deleteOne({UserID: client}, function(err, results) {
	// 	console.log('User document removed');
	// });
})