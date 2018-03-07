import React from 'react';

class Listing extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="listing" onClick={this.props.clickHandler}>
				<div className="listing-title">
					<a target="_blank" href={this.props.listing}>
						<img src={this.props.listing.photo} />
					</a>
					<h3>{this.props.listing.title}</h3>
					
				</div>
				<p>{this.props.listing.description}</p>
				<p>Price: {this.props.listing.price}</p>
				<p>Contact: {this.props.listing.username}</p>
			</div>
		)
	}
}

export default Listing;