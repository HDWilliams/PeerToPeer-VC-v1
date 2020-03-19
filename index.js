//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const assert = require('assert');
const bodyParser = require('body-parser')
//import peerjs library
const URI = process.env.MONGODB_URI;


MongoClient = require('mongodb').MongoClient;

let db = MongoClient.connect(process.env.MONGODB_URI, function (error, client) {
  assert.equal(null, error);
  console.log('connected to db');
  db = client.db('heroku_xr0pdhrx');
});

module.exports = {
	database: db
}

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

const SERVER = app.listen(PORT, ()=> console.log("I'm listening on port ${PORT}"));

// PEER SERVER SETUP
const peerServerOptions = {
	debug: false,
}
const peerServer =  require('peer').ExpressPeerServer(SERVER, peerServerOptions);

app.use('/peerjs', peerServer);


// MongoDB Collections and Formmating
// openChats: A collection that contains all of the active chat topic
// Example document for 'openChats'
//  {
// 	members: ['id1', 'id2', 'id3'], // list of ids of the users
// 	isAvailable: false // determines if the topic can be joined
// 	topic: 'Dolphin Health' // the chat topic in basic string format
// }



// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))


//initial placeholder route
app.get('/', (req, res)=>{
	res.status(200);
	return res.send("This is a placeholder!");
})

//return a list of all open chats in the db. Needs to be set up with routing before use
app.get('/getTopicList', (req, res)=>{
	res.status(200);
	db.collection('openChats', function(error, coll) {
		coll.find({}).toArray(function(err, chats) {
			assert.equal(err, null);
			return res.send(chats);
		})
	});
})

// When the client makes a call to this endpoint, we will assume that they are attempting to
// join an exising call, and we will treat it as such.
// This extension, when called, will lock the topic such that new members cannot join UNTIL
// the client makes a call to either 'joinTopicSuccessfully' or 'joinTopicFail', which will
// indicate to the server the success of their call
app.get('/getTopicMembers', (req, res) =>{
	if (!req.body.topic){
		res.status(400);
		return res.send({errorMsg: "Client error, this request must contain a topic name"})
	}
	const topicName = req.body.topic

	db.collection('openChats', function(err, coll) {
		if (err) {
			res.status(500);
			return res.send({errorMsg: "Database error"});
		}

		coll.findOneAndUpdate({topicName: topicName},
			{ $set: {
				isAvailable: false
			}},
			function(err, topic) {
				if (err) {
					res.status(500);
					return res.send({errorMsg: "Database error occurred while accessing the topic"});
				}
				else if (topic.value == null) {
					res.status(400);
					return res.send({errorMsg: "Could not find a group with that topic!"});
				}
				else {
					console.log('Topic found! Successfully locked topic')
					console.log(topic.value.members);
					res.status(200);
					return res.send({topicMembers: topic.value.members});
				}
			})
		})
})


//retreive all active users
app.get('/getUsers', (req, res)=> {
	db.collection('users', (err, coll)=>{
		coll.find({}).toArray(function(err, users){
			if (err){
				res.status(500);
				return res.send({errorMsg: 'Error in retreiving user data'});
			}
			else{
				res.status(200);
				return res.send({activeUsers: users.map((user)=>user.name)});
			}

		})

	})
})



//Person is making a 'Topic'
//Creates a document in openChats on Mongo
//Adds the creator in to list of participants
app.post('/createChat', (req, res) =>{
	if (!req.body.userID || !req.body.topic){
		res.status(400);
		return res.send({errorMsg: 'Client error, this request must contain a topic name and relevant userID'})
	} else{
		db.collection('openChats', function(error, coll) {
			coll.findOne({topicName: req.body.topic},function(err, doc){
				if (err){
					res.status(500);
					return res.send({errorMsg: "Error on database insert operation while creating a chat"})
				} else if(doc){  
					res.status(400);
					return res.send({errorMsg: 'Please choose a unique Topic name'});
				} else{
					coll.insert(
						{topicName:req.body.topic,
						members:[req.body.userID],
						isAvailable: true},
					function(err, records){
						if (err){
							res.status(500);
							return res.send({errorMsg: 'Server error while creating new Topic...'});
						} else{
							res.status(200);
							console.log("Created new topic", records);
							return res.send();
						}
					})
				}
			})
		})
	}
})
//redirect to something???


//Once the new user is all connected, adds the new user to the chat members list
//sets the isAvailable Boolean to True
app.post('/joinedTopicSuccessfully', (req, res) =>{
	console.log(req.body);
	const topicToJoin = req.body.topic;
	const userID = req.body.userID;
	if (!req.body.topic || !req.body.userID) {
		res.status(400);
		return res.send({errorMsg: "Please provide both a topic name and userID to utilize this endpoint"});
	}

	db.collection('openChats', function(err, coll) {
		coll.findOne({topicName: topicToJoin}, function(err, topic){
			if (err) {
				res.status(500);
				return res.send({errorMsg: "Database error occurred while joining the topic"});
			}
			else if (topic == null) {
				// This is an extremely unlikely scenario, but let's catch it
				res.status(400);
				return res.send({errorMsg: "We couldn't find the topic you wanted to join"});
			}
			else {
				console.log(topic);
				const newMembers = [...topic.members, userID];
				console.log(newMembers);
				// set the new topic to include this client and then reset the availability boolean
				// of the topic
				coll.updateOne({topicName: topicToJoin},
					{ $set: {
						members: newMembers,
						isAvailable: true
					}},
					function(err, updatedTopic) {
						if (!err) {
							console.log('successfully joined topic with no issues!')
							res.status(200);
							return res.send();
						}
						else {
							console.log('joining topic failed for some mongoDB error');
							res.status(500);
							return res.send({errorMsg: "Database error occurred while joining the topic"});
						}
				});
			}

		})
	});
})

// This is called when the user has failed to make all of the calls that they are
// supposed to make. Since the user hasn't actually joined the topic, all we really have
// to do is make the topic available for other users to join
app.post('/joinedTopicFail', (req, res) => {

	if (!req.body.topic) {
		res.status(400);
		return res.send({errorMsg: "Please provide a topic name to utilize this endpoint"});
	}
	const topicToJoin = req.body.topic;
	db.collection('openChats', function(err, coll) {
		if (err) {
			res.status(500);
			return res.send({errorMsg: "Database error occurred while joining the topic"});
		}
		else {
			coll.updateOne({topicName: topicToJoin},
				{ $set: { isAvailable: true
				}},
				function(err, updatedTopic){
					if (err){
						res.status(500);
						return res.send({errorMsg: "Database error occurred while joining the topic"});
					}
					else if (updatedTopic.result.n == 0) {
						console.log('no documents were found that matched that topic');
						res.status(400);
						return res.send({errorMsg: "No documents matched the requested topic"});
					}
					else {
						console.log('Successfully made topic available to be joined');
						res.status(200);
						return res.send();
					}
				});
		}
	});
})


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
	// Users.remove({userID: client}, function(err, results) {
	// 	console.log('User document removed');
	// });
})
