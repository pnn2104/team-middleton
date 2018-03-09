import React, {Component} from 'react';
import postDummyData from './postDummyData.jsx';
import Listing from './Listing.jsx'
import ListingModal from './ListingModal.jsx';
import ChatApp from './ChatApp.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import { USER_CONNECTED, PRIVATE_MESSAGE, MESSAGE_SENT, MESSAGE_RECEIVED} from '../events.js';

const socketUrl = "http://localhost:3000/"
export default class CommunityBoard extends Component {
	constructor(props){
		super(props)
		this.state = {
			listings: [],
			open: false,
			openChat: false,
			slidesMedia: [],
			socket: null,
			user: null,
			chats: [],
			receiver: null,
			chatId: null
			//showChats: false //open the chatbox without contacting anyone;
			//options: ['Bedroom', 'Kitchen', 'Dining Room', 'Appliance', 'Electronics', 'Clothes', 'Misc']
			//showManageListings: false
		}
		this.handleClose = this.handleClose.bind(this);
		this.openSlideShow = this.openSlideShow.bind(this);
		this.toggleChatBox = this.toggleChatBox.bind(this);
		this.getAllPosting = this.getAllPosting.bind(this);
		this.initSocket = this.initSocket.bind(this);
		this.setUser = this.setUser.bind(this);
		this.initializePrivateChat = this.initializePrivateChat.bind(this);
		this.addChat = this.addChat.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.showChatWithoutContact = this.showChatWithoutContact.bind(this);
	}

	componentDidMount() {
		this.getAllPosting()
		//init socket here	
	}

	componentWillMount() {
		this.initSocket();
	}

	initSocket() {
		//socket Url here is just local host for now
		const socket = io(socketUrl);
		socket.on('connect', function() {
			console.log('connected');
		})
		this.setState({
			socket
		}, () => {
			this.setUser()
			console.log('Sockets', this.state.socket);
		});
	}

	setUser() {
		const username = JSON.parse(sessionStorage.getItem('user'));
		const socket = this.state.socket;
		//console.log('socket', socket);
		this.setState({
			user: username
		}, () => {
			socket.emit(USER_CONNECTED, {name: this.state.user});
			//console.log('setState user', this.state.user);
		});
	} 

	initializePrivateChat() {
		//on private message, add chat 
		this.state.socket.on(PRIVATE_MESSAGE, this.addChat);
		const data = {receiver: this.state.receiver, sender: this.state.user};
		console.log('data: ', data);
		this.state.socket.emit(PRIVATE_MESSAGE, data);
		//console.log('newChat', newChat);
		//this.state.socket.emit('TEST', data);
	}

	//add a chat when a username is clicked
	addChat(chat) {
		console.log('client side chat', chat);
		const socket = this.state.socket
		this.setState({
			chatId: chat.id
		})
		//shallow copies of array of chats
		const chats = this.state.chats.slice();
		chats.push(chat);
		console.log('chats', chats);
		this.setState({chats})

		const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}
	
	addMessageToChat(chatId) {
		//looping thru the chats array
		return (message) => {
			const chats = this.state.chats;
			let newChats = chats.map((chat) => {
				if (chat.id === chatId) {
					chat.messages.push(message);
					return chat
				}
			})
			this.setState({
				chats: newChats
			})
		}
			//for each chat 
				//check for chat id
					//push message to chat.messages
		//set state of the chat again
	}

	sendMessage(chatId, message) {
		console.log("chatId", chatId, "message", message)
		const socket = this.state.socket;
		socket.emit(MESSAGE_SENT, {chatId, message})
	} 

	getAllPosting() {
		axios.get('/allPosts')
		.then((res) => {
			console.log('client data', res.data)
			this.setState({
				listings: res.data
				//receiver state property
			})
		})
	}

	showChatWithoutContact() {
		this.setState({
			openChat: !this.state.openChat,
			//when the chat box is open, receiver state property is also set to the receiver that was clicked on
			receiver: event.target.value
		}, () => {
			this.initializePrivateChat()
			//want to include addChat here
		})
	}
	//toggle state open chat for conditional rendering of the chat box in community component
	//at the same time, add a chat to the side bar
	toggleChatBox(event) {
		//handle setting the receiver
		this.setState({
			openChat: !this.state.openChat,
			//when the chat box is open, receiver state property is also set to the receiver that was clicked on
			receiver: event.target.value
		}, () => {
			this.initializePrivateChat()
			//want to include addChat here
		})
	}

	openSlideShow(target) {
		this.setState({
			open: !this.state.open,
			slidesMedia: target.image
		});
	}

	handleClose() {
		this.setState({
			open: false
		});
	}

	render() {
		//const chatNoContact = this.state.showChats ? <ChatApp /> : <div></div>
		//passdown the receiver to the ChapApp
		const chat = this.state.openChat ? <ChatApp initializePrivateChat={this.initializePrivateChat} 
																								openChat={this.state.openChat} receiver={this.state.receiver} 
																								socket={this.state.socket} user={this.state.user}
																								chats={this.state.chats}
																								sendMessage={this.sendMessage}
																								chatId={this.state.chatId}
																			 /> : <div></div>
		//rendering the modal that displays the listings' pictures
		if (this.state.open) {
			return <ListingModal slidesMedia={this.state.slidesMedia} open={this.state.open} handleClose={this.handleClose}/>
		} 
		return (
			<div className="community-board">	
				{this.state.listings.map((listing, i) => {
					{console.log('this.state.listings: ', this.state.listings)}
					return (
						<Listing key={i} listing={listing} openSlideShow={this.openSlideShow} toggleChatBox={this.toggleChatBox}/>
					)
				})}
				{chat}
				<button onClick={this.showChatWithoutContact}>Show Chats</button>
			</div>
		)
	}
}