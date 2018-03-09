const uuidv4 = require('uuid/v4');
//allows us to have unique id for every user

//create user using the username when logged in 
const createUser = ({name = ""} = {}) => {
	return {
		id: uuidv4(),
		name
	}
}
//create message

const createMessage = ({message = "", sender = ""} = {}) => {
	return (
		{
			id: uuidv4,
			time: getTime(new Date(Date.now())),
			message,
			sender
		}
	)
}

//create chat
const createChat = ({messages = [], name = "Community", users = []} = {}) => {
	return (
		{
			id: uuidv4(),
			name,
			messages,
			users,
			typingUsers: []
		}
	)
}


//send message to a private chat
function sendMessageToChat(sender){
	return (chatId, message)=>{
		io.emit(`${MESSAGE_RECIEVED}-${chatId}`, createMessage({message, sender}))
	}
}

const getTime = (date) => {
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createChat,
	createMessage,
	createUser
}
