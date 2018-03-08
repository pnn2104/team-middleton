import React, {Component} from 'react';
import postDummyData from './postDummyData.jsx';
import Listing from './Listing.jsx'
import ListingModal from './ListingModal.jsx';
import ChatApp from './ChatApp.jsx';
import axios from 'axios';
import io from 'socket.io-client';
import { USER_CONNECTED, PRIVATE_MESSAGE } from '../events.js';

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
			receiver: null
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
		this.state.socket.emit('TEST', data);
	}

	//add a chat when a username is clicked
	addChat(chat, reset) {
		// const chat = {
		// 	participents: [this.state.user, this.state.receiver],
		// 	messages: [],
		// 	chatId:  
		// }
		// chats = this.state.chats;
		// chats.push(chat);
		// this.setState({chats});
		//push into the chats array a chat object that has the name os the receiver & chat id & arrays of messages
	}

	addMessageToChat(chatId) {
		
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
		//passdown the receiver to the ChapApp
		const chat = this.state.openChat ? <ChatApp initializePrivateChat={this.initializePrivateChat} 
																								openChat={this.state.openChat} receiver={this.state.receiver} 
																								socket={this.state.socket} user={this.state.user}
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
			</div>
		)
	}
}