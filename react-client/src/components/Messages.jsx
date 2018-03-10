import React from 'react';
import Message from './Message.jsx';

class Messages extends React.Component {
	constructor(props) {
		super(props);
		this.scrollDown = this.scrollDown.bind(this);
	}

	scrollDown() {
		const {container} = this.refs;
		container.scrollTop = container.scrollHeight;
	}

	componentDidMount() {
		this.scrollDown()
	}

	componentDidUpdate() {
		this.scrollDown()
	}

	render() {
		return (
			<div className="chat-messages" ref="container">
			{this.props.activeChat.messages ? this.props.activeChat.messages.map((message, i) => {
				return (
					<Message key={i} message={message}/>
				)
			}) : ''}
			</div>
		)
	}
}

export default Messages;