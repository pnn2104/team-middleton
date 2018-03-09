import React from 'react';
import Message from './Message.jsx';

class Messages extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
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