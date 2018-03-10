import React from 'react';

const Message = (props) => {
  return (
		<div className="message-container">
			{/* <div className="time">{props.message.time}</div> */}
			<div className="data">
				<div className="chat-message">{props.message.message}</div>
				<div className="sender-name">{props.message.sender + ' ' + props.message.time}</div>
			</div>
		</div>
  )
}

export default Message;