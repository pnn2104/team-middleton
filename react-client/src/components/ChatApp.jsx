import React from 'react';
import Messages from './Messages.jsx';
import ChatInput from './ChatInput.jsx';
import Sidebar from './Sidebar.jsx';
import io from 'socket.io-client';
import axios from 'axios';
import { USER_CONNECTED, VERIFY_USER, PRIVATE_MESSAGE } from '../events.js';

//const socketUrl = "http://localhost:3000/"
class ChatApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chats: [],
			message: ''
		}
		this.submitHandler = this.submitHandler.bind(this);
		this.getChatMessages = this.getChatMessages.bind(this);
		this.updateMessage = this.updateMessage.bind(this);
		//this.initSocket = this.initSocket.bind(this);
		//this.setUser = this.setUser.bind(this);
	}
	componentDidMount() {
		this.getChatMessages();
	}

	getChatMessages() {
		axios.get('/getChatMessages', { sender: this.props.user, receiver: this.props.user })
			.then((res) => {
				console.log('helllloo', this.props.user)
				//console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			})
	}

	// componentWillMount() {
	// 	this.setState({
	// 		chats: this.props.chats
	// 	})
	// }

	//add message to the message array of a specific chat (using chat id)
	updateMessage(value) {
		this.setState({
			message: value
		}, () => {
			console.log('this.state.message', this.state.message)
		})
	}

	submitHandler(event) {
		this.setState({
			message: event.target.value
		})
	}

	render() {
		//	const overlay = this.props.chats[0].messages ? <Messages chats={this.props.chats}/> : <div></div>
		return (
			<div className="chat-app">
				{/* {overlay} */}
				<Messages activeChat={this.props.activeChat} chats={this.props.chats} message={this.state.message} chatId={this.props.chatId} />
				<ChatInput chats={this.props.chats}
					submitHandler={this.submitHandler}
					sendMessage={this.props.sendMessage}
					chatId={this.props.chatId}
					receiver={this.props.receiver}
					sender={this.props.user}
					updateMessage={this.updateMessage}
					chatname={this.props.chatname} />
			</div>
		)
	}
}

export default ChatApp;