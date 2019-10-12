//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const assert = require('assert');
const bodyParser = require('body-parser')
//import peerjs library
const URI = process.env.MONGODB_URI;


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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
  
const SERVER = app.listen(PORT, ()=> console.log(`I'm listening on port ${PORT}`));

//initial placeholder route
app.get('/', (req, res)=>{
	res.status(200);
	res.send("This is a placeholder!");
})

//return a list of all open chats in the db. Needs to be set up with routing before use
app.get('/getOpenChats', (req, res)=>{
	res.status(200);
	db.collection('openChats', function(error, coll) {
		coll.find({}).toArray(function(err, chats) {
			assert.equal(err, null);
			res.send(chats);
		})
	});
})

//openChats Document format
	// 1.) Array of IDs of people in chat
	// 2.) isAvailable boolean, is someone trying to join the chat?

//Person is making a 'Topic'
//POST Request Endpoint
//Creates a document in openChats on Mongo
//Adds the creator in to list of participants

app.get('/getUsers', (req, res)=> {
	res.status(200);
	db.collection('users', (err, coll)=>{
		coll.find({}).toArray(function(err, users){
			assert.equal(err, null);
			res.send(users)
		}) //ASK ROHUN ABOUT THIS PART
		
	})
})
//need userID and chat name is req body
//first check if user is in a chat rn, if they are tell them they cannot
// app.post('/createChat', (req, res) =>{
// 	res.status(200);
// 	let currentChat = null;
// 	db.collection('users', function(err, coll){
// 		currentChat = coll.find({userID: req.body.userID})
// 		return currentChat;
// 	})
// 	//if True, create chat, if not send error message or redirect perhaps
// 	if (currentChat === null){
// 		db.collection('openChats', function(error, coll) {
// 			coll.insert({chatName:req.body.name, members:[req.body.userID]}, function(err, records){
// 				assert.equal(err, null);
// 				res.send(`You are now the proud owner of a Topic...${records[0]._id}`);
// 				let currentChat = records[0]._id;
// 				return currentChat;
// 			})
// 		db.collection('users', function(err, coll){
// 			coll.insert({currentChat: currentChat}, function(err, records){
// 				assert.equal(err, null);
// 				res.send(`Chat ${currentChat} has been stored in your account info while the chat is open`);
// 			})
			
// 	} else {
// 		res.send('You are already in a chat...');
// 	}
	
// 	})

// }) 
//redirect to something???


//person trying to join a topic
//POST Request Endpoint
//Set Boolean value to False until new user is connected
app.post('/joinChat', (req, res) =>{
	
})
//Redirect to GET request Send the client a list of all members of current chat
//will need to have some sort of change stream or the like for the boolean value
app.get('/available', (req, res) =>{
	
})

//Post Request Endpoint
//Once the new user is all connected, adds the new user to the chat members list
//sets the isAvailable Boolean to True
app.post('/joined', (req, res) =>{
	
})

const peerServerOptions = {
	debug: false,
}
const peerServer =  require('peer').ExpressPeerServer(SERVER, peerServerOptions);

app.use('/peerjs', peerServer);


peerServer.on('connection', (client) => {
	console.log('Connection established from ', client);
	db.collection('users', function(error, coll) {
		coll.insert({userID: client}, function(err, results) {
			console.log('client ID added to Users collection');
		});
	});
})
peerServer.on('disconnect', (client) => {
	console.log('Disconnection from ', client);
	// Users.deleteOne({userID: client}, function(err, results) {
	// 	console.log('User document removed');
	// });
})