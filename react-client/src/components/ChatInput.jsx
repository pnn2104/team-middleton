import React from 'react';
import { MESSAGE_SENT } from '../events.js';
import axios from 'axios';
class ChatInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//messagesToBePersisted: [],
			message: ''
		}
		this.changeHandler = this.changeHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		// this.submit = this.submit.bind(this);
	}

	// submit(event) {
	// 	this.setState({
	// 		message: event.target.value
	// 	}, () => {
	// 		this.props.submitHandler(this.state.message);
	// 	})
	// }
	submitHandler(event) {
		event.preventDefault()
		this.sendMessage();
		this.props.updateMessage(this.state.message);
		this.setState({
			message: ''
		})
		//persisting the messages send to a specific receiver
		//const messagesToBePersisted = this.state.messagesToBePersisted.slice();
		//messagesToBePersisted.push(this.state.message);
		// axios.post('/persistMessages',
		// 	{
		// 		message: this.state.message,
		// 		receiver: this.props.receiver,
		// 		sender: this.props.sender
		// 	})
		// 	.then((err) => {
		// 		if (err) throw err
		// 	})
	}

	sendMessage() {
		console.log('Chat input this.state.message', this.state.message);
		this.props.sendMessage(this.props.chatId, this.state.message)
	}

	changeHandler(event) {
		this.setState({
			message: event.target.value
		})
	}


	render() {
		return (
			<div className="chat-input">
				<form onSubmit={this.submitHandler}>
					<input className="chat-input-text" value={this.state.message} type="text/submit" placeholder={`I am ${this.props.sender}`} onChange={(e) => this.changeHandler(e)}></input>
					<input className="chat-input-button" type="submit" value="Submit"></input>
				</form>
			</div>
		)
	}
}

export default ChatInput;
