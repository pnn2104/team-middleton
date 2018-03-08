import React from 'react';
import ListingModal from './ListingModal.jsx';

class Listing extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {
		return (
			<div className="listing">
				<div className="listing-title" onClick={() => this.props.openSlideShow(this.props.listing)}>
					<a target="_blank" href={this.props.listing.image[0]}>
						<img src={this.props.listing.image[0]} />
					</a>
					<h3>{this.props.listing.title}</h3>
				</div>
				<div>
					<p>{this.props.listing.description}</p>
					<p>Price: {this.props.listing.price}</p>
					<p>Contact: <button onClick={this.props.toggleChatBox} value={this.props.listing.username}>{this.props.listing.username}</button></p>
				</div>
			</div>
		)
	}
}

export default Listing;