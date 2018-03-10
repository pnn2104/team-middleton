// var io = require('./index.js');
// console.log('IOOOO', io);
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

module.exports = function (socket, io) {
	//console.log("Socket ID:" + socket.id)
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
		//console.log('data: ', data);
		//console.log('receiver', receiver, 'sender', sender);
		//console.log("connectedUsernames", connectedUsers);
		const connectedUsernames = Object.keys(connectedUsers);
		if (connectedUsernames.indexOf(data.receiver) !== -1) {
			const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] })
			//console.log("newChat", newChat);
			const receiverSocket = connectedUsers[receiver].socketId;
			socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
			 //emit to the socket of the other person connected in connected users
			//io.in(newChat.name).emit(PRIVATE_MESSAGE, newChat.messages); 
			//socket.to(senderSocket).emit(PRIVATE_MESSAGE, newChat)
			socket.emit(PRIVATE_MESSAGE, newChat)
			sendMessageToChatFromUser = sendMessageToChat(newChat.name, sender, io)
			//saving chat Id to database table "chat", schema below 
			// let queryString = "INSERT IGNORE INTO chat (chatId, users) VALUES (?, ?)";
			// let params = [newChat.id, JSON.stringify(newChat.users)];
			// db.connection.query(queryString, params, function (err) {
			// 	if (err) throw err;
			// })
			//console.log('params', params);
			//if the receiver is not connected
		} else if (connectedUsernames.indexOf(data.receiver) === -1 && data.receiver !== data.sender) {
			//create the chat object anyways 
			const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] })
			//console.log('receiver not connected chat', newChat);
			//save it to the database
			sendMessageToChatFromUser = sendMessageToChat(newChat.name, sender, io)
			// let queryString = "INSERT IGNORE INTO chat (chatId, users) VALUES (?, ?)";
			// let params = [newChat.id, JSON.stringify(newChat.users)];
			// db.connection.query(queryString, params, function (err) {
			// 	if (err) throw err;
			// })
		}
	})

	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		//console.log("chatId", chatId, "message", message);
		sendMessageToChatFromUser(chatId, message);
	})
}

//function that takes in a sender
//return a function that take a chat id and a message
//and then emit a broadcast to the chat id
function sendMessageToChat(chatname, sender, io) {
	//console.log('sender', sender, "chatname", chatname);
	return (chatId, message) => {
		//console.log("SocketMager chatId", chatId, 'message',  message);
		//console.log("io", io)
		// io.in(chatname).emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender })); 
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
