import React, { Component } from 'react'
import ModalPopover from './PostModal.jsx'
import axios from 'axios'
import Modal from 'react-modal';

const customStyles = {
  content : {
  	height: `20%`,
  	width: `20%`,
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class Input  extends Component {
	constructor(props){
		super(props)
		this.state = {
			posts: [],
			showModal: false
		}

		this.getPosts = this.getPosts.bind(this)
		this.updateViewableModal = this.updateViewableModal.bind(this)
	}

	componentDidMount(){
		this.getPosts()
	}

	getPosts(){

	}

	updateViewableModal(){
		this.setState({showModal: !this.state.showModal})
	}


	render(){
		return(
			<div className="mylistings-container">
				<h1>MyListings</h1>
				<ModalPopover />
			</div>
		)
	}
}