import React, { Component } from 'react'
import axios from 'axios'


export default class Input extends Component {
	constructor(props){
		super(props)
		this.state = {
			title:'',
			description: '',
			category: 'none',
			isDonation: false,
			price: '',
			zipcode: '',
			photo: null,
			categories: []
		}
		this.handleTitle = this.handleTitle.bind(this)
		this.handleDescription = this.handleDescription.bind(this)
		this.handleCategory = this.handleCategory.bind(this)
		this.handleDonation = this.handleDonation.bind(this)
		this.handlePrice = this.handlePrice.bind(this)
		this.handleZipCode = this.handleZipCode.bind(this)
		this.handlePhotoFile = this.handlePhotoFile.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.getCategories = this.getCategories.bind(this)
	}

	componentDidMount(){
		this.getCategories()
	}

	getCategories(){
		axios.get('/categories')
		     .then((data) =>{
		     	console.log(data.data)
		     	this.setState({categories: data.data})
		     })
	}

	handleTitle(e){
		this.setState({
			title: e.target.value
		})
	}
	handleDescription(e){
		this.setState({
			description: e.target.value
		})
	}
	handleCategory(e){
		this.setState({category: e.target.value})
	}
	handleDonation(e){
		this.setState({isDonation: e.target.value})
	}
	handlePrice(e){
		this.setState({
			price: e.target.value
		})
	}
	handleZipCode(e){
		this.setState({
			zipcode: e.target.value
		})
	}
	handlePhotoFile(e){
		this.setState({
			photo: e.target.files
		}, () => console.log(this.state.photo))
	}

	handleSubmit(e){
		e.preventDefault()
		let newListing = new FormData()
		newListing.append('title',this.state.title)
    	newListing.append('description',this.state.description)
    	newListing.append('price',this.state.price)
    	newListing.append('isDonation',this.state.isDonation)
    	newListing.append('category',this.state.category)
    	if (this.state.photo !== null) {
      			for(let key in this.state.photo){
      				newListing.append('photo', this.state.photo[key])
      			}
    	} 
		axios.post('/newpost', newListing)
		     .then((this.setState({
		     	title: '',
		     	description: '',
		     	category: '', 
		     	isDonation: '',
		     	price: '',
		     	zipcode: '',
		     	photo: null
		     })))
	}

	render(){
		return(
			<div className="form-container">
					<form>
						<input type="text" value={this.state.title} placeholder="Title" onChange={this.handleTitle} />
						<input type="text" value={this.state.description} placeholder="Description" onChange={this.handleDescription} />
						<input type="text" value={this.state.price} placeholder="Price" onChange={this.handlePrice} />
						<input type="text" value={this.state.zipcode} placeholder="Zip Code" onChange={this.handleZipCode} />
						<label>
          					<select value={this.state.isDonation} onChange={this.handleDonation}>
            					<option value="true">Yes</option>
            					<option value="false">No</option>
          					</select>
        				</label>
						<label>
          				<select value={this.state.category} onChange={this.handleCategory}>
            					{
            						this.state.categories.map((cat, i) => <option key={i} value={cat.description}>{cat.description}</option>)
            					}
          				</select>
        				</label>
        				<input name="img" type="file" multiple onChange={this.handlePhotoFile}/>
						<button onClick={this.handleSubmit}> Click Me</button>
					</form>
				</div>
		)
	}
}