import React, {Component} from 'react';
import ModalPopover from './PostModal.jsx';
import Listing from './userListingItem.jsx';
import Modal from 'react-awesome-modal';
import axios from 'axios';
import postDummyData from './postDummyData.jsx';

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      modalVisible: false
    };

    this.getPosts = this.getPosts.bind(this);
    this.handleModal = this.handleModal.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    axios.get('/userPosts').then((data) => {
      this.setState({posts: data.data});
    });
  }

  handleDelete(id){
    axios.post('/deletepost', {id: id})
         .then((done) =>{
            this.getPosts()
         })
  }

  handleModal(){
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  render() {
    return (

        <div >
          <button className="show-modal" onClick={this.handleModal}> Create a Listing </button>

        <Modal 
          visible={this.state.modalVisible}
          width="550"
          height="475"
          effect="fadeInUp"
          onClickAway={() => this.handleModal()}
          >
            <div className="user-modal">
              <a className="user-modal-close" href="javascript:void(0);" onClick={() => this.handleModal()}>X</a>
              <h1 className="user-modal-title">Create a Post</h1>
              <ModalPopover handleModal={this.state.handleModal}/>
            </div>
        </Modal>
        {
          this.state.posts.map((listing,i) =>{
            return (
              <Listing key={i} listing={listing} handleDelete={this.handleDelete} />
            )
          })
        }
        </div>
    );
  }
}
