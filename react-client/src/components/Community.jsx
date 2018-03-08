import React, {Component} from 'react';
import postDummyData from './postDummyData.jsx';
import Listing from './Listing.jsx'
import ListingModal from './ListingModal.jsx';
import ChatApp from './ChatApp.jsx';

export default class CommunityBoard extends Component {
	constructor(props){
		super(props)
		this.state = {
			listings: postDummyData,
			open: false,
			openChat: false,
			slidesMedia: []
			//options: ['Bedroom', 'Kitchen', 'Dining Room', 'Appliance', 'Electronics', 'Clothes', 'Misc']
			//showManageListings: false
		}
		this.handleClose = this.handleClose.bind(this);
		this.openSlideShow = this.openSlideShow.bind(this);
		this.toggleChatBox = this.toggleChatBox.bind(this);
	}
	//toggle state open chat for conditional rendering
	toggleChatBox(target) {
		this.setState({
			openChat: !this.state.openChat
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
		const chat = this.state.openChat ? <ChatApp openChat={this.state.openChat}/> : <div></div>
		//rendering the modal that displays the listings' pictures
		if (this.state.open) {
			return <ListingModal slidesMedia={this.state.slidesMedia} open={this.state.open} handleClose={this.handleClose}/>
		} 
		return (
			<div className="community-board">	
				{this.state.listings.map((listing, i) => {
					return (
						<Listing key={i} listing={listing} openSlideShow={this.openSlideShow} toggleChatBox={this.toggleChatBox}/>
					)
				})}
				{chat}
			</div>
		)
	}
}