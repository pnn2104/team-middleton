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
	// componentDidMount() {
	// 	this.setState({
	// 		chats: this.props.chats
	// 	})
	// }

	//add message to the message array of a specific chat (using chat id)
	

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
				<Messages chats={this.props.chats}/>
				<ChatInput chats={this.props.chats} submitHandler={this.submitHandler} sendMessage={this.props.sendMessage} chatId={this.props.chatId}/>
				<Sidebar />
			</div>
		)
	}
}

export default ChatApp;