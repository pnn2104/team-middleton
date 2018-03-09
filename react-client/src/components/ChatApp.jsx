import React from 'react';
import Messages from './ChatInput.jsx';
import ChatInput from './Messages.jsx';
import Sidebar from './Sidebar.jsx';
import io from 'socket.io-client';
import { USER_CONNECTED, VERIFY_USER, PRIVATE_MESSAGE } from '../events.js';

//const socketUrl = "http://localhost:3000/"
class ChatApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//socket: null,
			//user: null
		}
		//this.initSocket = this.initSocket.bind(this);
		//this.setUser = this.setUser.bind(this);
	}
	componentWillMount() {
		//initializing socket connection
		//this.initSocket()
		//this.props.initializePrivateChat()
	
		
		//console.log('username from session storage', JSON.parse(sessionStorage.getItem('user')))
	}

	// initSocket() {
	// 	//socket Url here is just local host for now
	// 	const socket = io(socketUrl);
	// 	socket.on('connect', function() {
	// 		console.log('connected');
	// 	})
	// 	this.setState({
	// 		socket
	// 	}, () => {
	// 		this.setUser()
	// 		console.log('Sockets', this.state.socket);
	// 	});
		
	// }

	// setUser() {
	// 	const username = JSON.parse(sessionStorage.getItem('user'));
	// 	const socket = this.state.socket;
	// 	//console.log('socket', socket);
	// 	this.setState({
	// 		user: username
	// 	}, () => {
	// 		socket.emit(USER_CONNECTED, {name: this.state.user});
	// 		//console.log('setState user', this.state.user);
	// 	});
	// } 

	

	logout() {

	}
	render() {
		return (
			<div className="chat-app">
				<Messages />
				<ChatInput />
				<Sidebar />
			</div>
		)
	}
}

export default ChatApp;