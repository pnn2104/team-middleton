const io = require('./index.js').io;

const {
	VERIFY_USER,
	USER_CONNECTED,
	USER_DISCONNECTED,
	LOGOUT,
	COMMUNITY_CHAT,
	MESSAGE_RECEIVED,
	MESSAGE_SENT,
	TYPING,
	PRIVATE_MESSAGE
} = require('../react-client/src/events.js');

const {
	createUser,
	createMessage,
	createChat
} = require('./factories.js');

let connectedUsers = {};

module.exports = function(socket) {
	console.log("Socket ID:" + socket.id)
	
	// socket.on('VERIFY_USER')
	// socket.on(VERIFY_USER, (username, callback) => {
	// 	createUser({name: username})
	// 	//callback({user:createUser({name:username})})
	// })
	//user connect with username
	socket.on(USER_CONNECTED, (user) => {
		//console.log('user in server', user);
		//user socket id
		user.socketId = socket.id,
		//add the user to the list of connected users
		connectedUsers = addUser(connectedUsers, user);
		socket.user = user 
		//io.emit(USER_CONNECTED, connectedUsers)
		//console.log(connectedUsers);
	})

	// socket.on('USER_DISCONNECTED')

	// socket.on('MESSAGE_SENT')

	// socket.on('MESSAGE_RECEIVED')

	// socket.on('PRIVATE_MESSAGE')
}

//adding a user into a user list
//user is an object
function addUser(userList, user) {
	let newList = Object.assign({}, userList);
	newList[user.name] = user
	return newList
}