import React from 'react';
import Message from './Message.jsx';

class Messages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: []
		}
	}
	// componentDidMount() {
	// 	this.setState({
	// 		messages: this.props.chats.messages
	// 	})
	// }

	render() {
		// let messages = this.props.chat? this.props.chats.messages : []
		return (
			<div className="chat-messages">
			{/* {this.props.messages.map((message) => {
				return (
					<Message message={message}/>
				)
			})} */}
			</div>
		)
	}
}

export default Messages;