import React, {Component} from 'react';
import postDummyData from './postDummyData.jsx';
import Listing from './Listing.jsx'
import ListingModal from './ListingModal.jsx';

export default class CommunityBoard extends Component {
	constructor(props){
		super(props)
		this.state = {
			listings: postDummyData,
			open: false,
			slidesMedia: []
			//options: ['Bedroom', 'Kitchen', 'Dining Room', 'Appliance', 'Electronics', 'Clothes', 'Misc']
			//showManageListings: false
		}
		this.handleClose = this.handleClose.bind(this);
		this.openSlideShow = this.openSlideShow.bind(this);
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
		//rendering the modal that displays the listings' pictures
		if (this.state.open) {
			return <ListingModal slidesMedia={this.state.slidesMedia} open={this.state.open} handleClose={this.handleClose}/>
		} 
		return (
			<div className="community-board">
				
				{this.state.listings.map((listing, i) => {
					return (
						<Listing key={i} listing={listing} openSlideShow={this.openSlideShow}/>
					)
				})}
			</div>
		)
	}
}