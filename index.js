//require necessary modules and set port
const PORT = process.env.PORT || 5000;

const express = require('express');
const http = require('http');
const assert = require('assert');
const bodyParser = require('body-parser')
//import peerjs library
const URI = process.env.MONGODB_URI;


const MongoClient = require('mongodb').MongoClient;

let db = MongoClient.connect(process.env.MONGODB_URI, function (error, client) {
  assert.equal(null, error);
  console.log('connected to db');
  db = client.db('heroku_xr0pdhrx');
});


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
// openChats: A collection that contains all of the active chat groups
// Example document for 'openChats'
//  {
// 	members: ['id1', 'id2', 'id3'], // list of ids of the users
// 	isAvailable: false // determines if the group can be joined
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
app.get('/GetGroupList', (req, res)=>{
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
// This extension, when called, will lock the group such that new members cannot join UNTIL
// the client makes a call to either 'joinGroupSuccessfully' or 'joinGroupFail', which will
// indicate to the server the success of their call
app.get('/getGroupMembers', (req, res) =>{
	groupName = req.body.groupName
	if (!groupName){
		res.status(400);
		return res.send({errorMsg: 'Client error, this request must contain a group name'})
	}

	db.collection('openChats', function(err, coll) {
		if (err) {
			res.status(500);
			return res.send({errorMsg: "Database error"});
		}

		coll.updateOne({topicName: groupName},
			{ $set: {
				isAvailable: false
			}},
			function(err, group) {
				if (err) {
					res.status(500);
					return res.send({errorMsg: "Database error occurred while accessing the group"});
				}

				console.log('Group found! Successfully locked group')
				console.log(group.members)
				res.status(200);
				return res.send({groupMembers: "Hi"});
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
	if (!req.body.userID || !req.body.name){
		res.status(400);
		return res.send({errorMsg: 'Client error, this request must contain a group name and relevant userID'})
	} else{
		db.collection('openChats', function(error, coll) {
				coll.insert(
					{topicName:req.body.name,
					members:[req.body.userID],
					isAvailable: true},
					function(err, records){
					if (err){
						res.status(500);
						return res.send({errorMsg: "Error on database insert operation while creating a chat"})
					} else{
						res.status(200);
						console.log("Created new topic", records);
						return res.send();
					}

				})
		})
	}
})
//redirect to something???


//Once the new user is all connected, adds the new user to the chat members list
//sets the isAvailable Boolean to True
app.post('/joinedGroupSuccessfully', (req, res) =>{
	console.log(req.body);
	const topicToJoin = req.body.topic;
	const userID = req.body.id;
	if (!req.body.topic || !req.body.id) {
		res.status(400);
		return res.send({errorMsg: "Please provide both a topic name and user ID to utilize this endpoint"});
	}

	db.collection('openChats', function(err, coll) {
		coll.findOne({topicName: topicToJoin}, function(err, group){
			if (err) {
				res.status(500);
				return res.send({errorMsg: "Database error occurred while joining the group"});
			}
			else if (group == null) {
				// This is an extremely unlikely scenario, but let's catch it
				res.status(400);
				return res.send({errorMsg: "We couldn't find the group you wanted to join"});
			}
			else {
				console.log(group);
				const newMembers = [...group.members, userID];
				console.log(newMembers);
				// set the new group to include this client and then reset the availability boolean
				// of the group
				coll.updateOne({topicName: topicToJoin},
					{ $set: {
						members: newMembers,
						isAvailable: true
					}},
					function(err, updatedGroup) {
						if (!err) {
							console.log('successfully joined group with no issues!')
							res.status(200);
							return res.send();
						}
						else {
							console.log('joining group failed for some mongoDB error');
							res.status(500);
							return res.send({errorMsg: "Database error occurred while joining the group"});
						}
				});
			}

		})
	});
})

// This is called when the user has failed to make all of the calls that they are
// supposed to make. Since the user hasn't actually joined the group, all we really have
// to do is make the group available for other users to join
app.post('/joinedGroupFail', (req, res) => {

	if (!req.body.topic) {
		res.status(400);
		return res.send({errorMsg: "Please provide a topic name to utilize this endpoint"});
	}
	const topicToJoin = req.body.topic;
	db.collection('openChats', function(err, coll) {
		if (err) {
			res.status(500);
			return res.send({errorMsg: "Database error occurred while joining the group"});
		}
		else {
			coll.updateOne({topicName: topicToJoin},
				{ $set: { isAvailable: true
				}},
				function(err, updatedGroup){
					if (err){
						res.status(500);
						return res.send({errorMsg: "Database error occurred while joining the group"});
					}
					else if (updatedGroup.result.n == 0) {
						console.log('no documents were found that matched that group');
						res.status(400);
						return res.send({errorMsg: "No documents matched the requested topic"});
					}
					else {
						console.log('Successfully made group available to be joined');
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
