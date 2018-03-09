import React from 'react';
import { MESSAGE_SENT } from '../events.js';
class ChatInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
		// this.setState({
		// 	message: ''
		// })
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
					<input type="text/submit" onChange={(e) => this.changeHandler(e) }></input>
					<input type="submit" value="Submit"></input>
				</form>
			</div>
		)
	}
}

export default ChatInput;
