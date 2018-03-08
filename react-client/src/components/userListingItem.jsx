import React from 'react';
import ListingModal from './ListingModal.jsx';

class Listing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="listing"
        onClick={() => this.props.openSlideShow(this.props.listing)}>
        <div className="listing-title">
          <a target="_blank" href={this.props.listing.image[0]}>
            <img src={this.props.listing.image[0]} />
          </a>
          <h3>{this.props.listing.title}</h3>
        </div>
        <p>{this.props.listing.description}</p>
        <p>Price: {this.props.listing.price}</p>
        <p>Contact: {this.props.listing.username}</p>
      </div>
    );
  }
}

export default Listing;
