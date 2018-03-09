import React from 'react';
import Messages from './Messages.jsx';
import ChatInput from './ChatInput.jsx';
import Sidebar from './Sidebar.jsx';
import io from 'socket.io-client';
import { USER_CONNECTED, VERIFY_USER, PRIVATE_MESSAGE } from '../events.js';

//const socketUrl = "http://localhost:3000/"
class ChatApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chats: props.chats,
			message: ''
		}
		this.submitHandler = this.submitHandler.bind(this);
		//this.initSocket = this.initSocket.bind(this);
		//this.setUser = this.setUser.bind(this);
	}
	componentWillMount() {
		//initializing socket connection
		//this.initSocket()
		//this.props.initializePrivateChat()
	
		
		//console.log('username from session storage', JSON.parse(sessionStorage.getItem('user')))
	}

	//add message to the message array of a specific chat (using chat id)
	

	submitHandler(event) {
		this.setState({
			message: event.target.value
		})
	}

	render() {
		return (
			<div className="chat-app">
				<Messages />
				<ChatInput chats={this.props.chats} submitHandler={this.submitHandler} sendMessage={this.props.sendMessage} chatId={this.props.chatId}/>
				<Sidebar />
			</div>
		)
	}
}

export default ChatApp;