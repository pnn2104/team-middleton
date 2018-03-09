import React from 'react';
import ListingModal from './ListingModal.jsx';
import axios from 'axios'

class Listing extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div
        className="listing"
        onClick={() => this.props.openSlideShow(this.props.listing)}>
        <div className="listing-title">
          <a target="_blank" href={this.props.listing.image}>
            <img src={this.props.listing.image} />
          </a>
          <h3>{this.props.listing.title}</h3>
        </div>
        <p>{this.props.listing.description}</p>
        <p>Price: {this.props.listing.price}</p>
        <span><button className="user-delete" onClick={() => this.props.handleDelete(this.props.listing.id)} >Delete Post</button></span>
      </div>
    );
  }
}

export default Listing;
