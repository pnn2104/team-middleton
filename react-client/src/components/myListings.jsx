import React, {Component} from 'react';
import ModalPopover from './PostModal.jsx';
import Listing from './userListingItem.jsx';
import Modal from 'react-awesome-modal';
import axios from 'axios';
//import postDummyData from './postDummyData.jsx';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      showModal: false,
      modalVisible: false
    };

    this.getPosts = this.getPosts.bind(this);
    this.updateViewableModal = this.updateViewableModal.bind(this);
    this.handleModal = this.handleModal.bind(this)
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

  handleModal(){
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  render() {
    return (
      <div className="post-botton">
      <button onClick={this.handleModal}> Click Me </button>
      <Modal 
        visible={this.state.modalVisible}
        width="500"
        height="475"
        effect="fadeInUp"
        onClickAway={() => this.handleModal()}
        >
        <div className="user-modal">
         <a className="user-modal-close" href="javascript:void(0);" onClick={() => this.handleModal()}>X</a>
          <h1 className="user-modal-title">Create a Post</h1>
          <ModalPopover />
        </div>
        </Modal>
          {this.state.posts.map((item, i) => (
            <Listing key={i} listing={item} />
          ))}
      </div>
    );
  }
}
