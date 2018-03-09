var io = require('./index.js');
console.log('IOOOO', io);
//requiring database
var db = require('../database-mysql');

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

module.exports = function (socket) {
	console.log("Socket ID:" + socket.id)
	let sendMessageToChatFromUser;

	//user connect with username
	socket.on(USER_CONNECTED, (user) => {
		console.log('user in server', user);
		//user socket id
		user.socketId = socket.id,
			//add the user to the list of connected users
			connectedUsers = addUser(connectedUsers, user);
		socket.user = user
		//io.emit(USER_CONNECTED, connectedUsers)
		console.log('connected users', connectedUsers);
	})

	//on private messaging
	socket.on(PRIVATE_MESSAGE, (data) => {
		const { receiver, sender } = data;
		console.log('data: ', data);
		//console.log('receiver', receiver, 'sender', sender);
		//console.log("connectedUsernames", connectedUsernames);
		const connectedUsernames = Object.keys(connectedUsers);
		if (connectedUsernames.indexOf(data.receiver) !== -1) {
			const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] })
			//console.log("newChat", newChat);
			const receiverSocket = connectedUsers[receiver].socketId;
			//console.log("receiverSocket", receiverSocket)
			socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat)
			socket.emit(PRIVATE_MESSAGE, newChat)
			sendMessageToChatFromUser = sendMessageToChat(sender)
			//saving chat Id to database table "chat", schema below 
			let queryString = "INSERT IGNORE INTO chat (chatId, users) VALUES (?, ?)";
			let params = [newChat.id, JSON.stringify(newChat.users)];
			db.connection.query(queryString, params, function (err) {
				if (err) throw err;
			})
			//console.log('params', params);
			//if the receiver is not connected
		} else if (connectedUsernames.indexOf(data.receiver) === -1 && data.receiver !== data.sender) {
			//create the chat object anyways 
			const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] })
			console.log('receiver not connected chat', newChat);
			//save it to the database
			let queryString = "INSERT IGNORE INTO chat (chatId, users) VALUES (?, ?)";
			let params = [newChat.id, JSON.stringify(newChat.users)];
			db.connection.query(queryString, params, function (err) {
				if (err) throw err;
			})
		}
	})

	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		sendMessageToChatFromUser(chatId, message);
	})
}

	// socket.on('MESSAGE_RECEIVED')
	
	// socket.on('TEST', data => {
	// 	console.log('Testing with this data:', data);
	// });

	// socket.on(PRIVATE_MESSAGE, (data) => {
	// 	const {receiver, sender} = data;
	// 	console.log('data: ', data);
	// 	console.log('receiver', receiver, 'sender', sender);
	
	// 	const connectedUsernames = Object.keys(connectedUsers); 
	// 	//if (connectedUsernames.indexOf(data.receiver)) {
	// 		const newChat = createChat({name: `${receiver}&${sender}`, users: [receiver, sender]})
	// 		console.log("newChat", newChat);
	// 		const receiverSocket = connectedUsers["aileen"].socketId;
	// 		console.log("receiverSocket", receiverSocket)
	// 		// socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat)
	// 		// socket.emit(PRIVATE_MESSAGE, newChat)
	// 	//}
	// })

//function that takes in a sender
//return a function that take a chat id and a message
//and then emit a broadcast to the chat id
function sendMessageToChat(sender) {
	//console.log('sender', sender);
	return (chatId, message) => {
		//console.log("SocketMager chatId", chatId, 'message',  message);
		//console.log("io", io)
		io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }))
	}
}

//adding a user into a user list
//user is an object
function addUser(userList, user) {
	let newList = Object.assign({}, userList);
	newList[user.name] = user
	return newList
}
