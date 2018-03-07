import React, {Component} from 'react';
import ModalPopover from './PostModal.jsx';
import Listing from './Listing.jsx';
import axios from 'axios';
//import postDummyData from './postDummyData.jsx';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      showModal: false,
    };

    this.getPosts = this.getPosts.bind(this);
    this.updateViewableModal = this.updateViewableModal.bind(this);
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    axios.get('/userPosts').then(data => {
      this.setState({posts: data.data});
    });
  }

  updateViewableModal() {
    this.setState({showModal: !this.state.showModal});
  }

  render() {
    return (
      <div className="mylistings-container">
        <h1>MyListings</h1>
        <ModalPopover />
        <div className="community-board">
          {this.state.posts.map((item, i) => (
            <Listing key={i} listing={item} />
          ))}
        </div>
      </div>
    );
  }
}
