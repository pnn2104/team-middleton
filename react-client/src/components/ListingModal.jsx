import React from 'react';
import SimpleModalSlideshow from 'react-simple-modal-slideshow';

//props passed down are open & listings
class ListingModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentSlide: 0
		}
		// this.handleClose = this.handleClose.bind(this);
		this.handleNext = this.handleNext.bind(this);
		this.handlePrev = this.handlePrev.bind(this);
	}

	handleNext(index) {
		this.setState({
			currentSlide: index
		});
	}

	handlePrev(index) {
		this.setState({
			currentSlide: index
		});
	}

	render() {
		console.log('this.props.slideMedia', this.props.slidesMedia);
		const slides = this.props.slidesMedia.map((url) => {
			return {media: <img src={url}/>}
		})
		console.log('slides', slides);
		return (
			<SimpleModalSlideshow
				slides={slides}
				currentSlide={this.state.currentSlide}
				open={this.props.open}
				onClose={this.props.handleClose}
				onNext={this.handleNext}
				onPrev={this.handlePrev}
			/>
		)
	}
}

export default ListingModal