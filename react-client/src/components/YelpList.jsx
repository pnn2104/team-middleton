import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import YelpDummyData from './YelpDummyData.jsx';
import YelpListItem from './YelpListItem.jsx';
import GoogleMaps from './GoogleMap.jsx';


class YelpList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        YelpList: [],
        serviceQuery: 'movers',
        location: '10538',
        map: false,
        itemHovered: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.getYelpServices = this.getYelpServices.bind(this);
    this.getZipCodeServices = this.getZipCodeServices.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    //when Yelp List is mounted, it right away gets services
      // for that user's zip code, which is stored in the db
    this.getZipCodeServices();
  }
  
  getZipCodeServices () {
    // this calls the server function that gets the user's zipcode from the db
    axios.get('/zipcode')
    .then( (response) => {
      this.setState({
        //put the retrieved zip code from state, which is an array w/ 1 value
        location: response.data[0].zipcodefrom
      }, () =>{
        //once we have the zip code in state, get new yelp data for it
        this.getYelpServices()
      })
    }) 
  }

  getYelpServices () {
    //this gets data from yelp based on our seach terms for services
      // by default, it is set in state as movers, 
      //since that is the first item in the drop down list
    axios.get('/yelpRequest', {
      params: {
        term: this.state.serviceQuery,
        location: this.state.location
      }
    })
    //we then set the state value of Yelp List to the services we got
    .then((response) => {
      this.setState({
        YelpList: response.data,
        // once we have yelp data, we only then set the map value in state to true, 
        // which is what makes the google map itself render (see if statement in our render)
        map: true
      }) 
    })
    .catch((err) => {
      console.error(err)
    })
  }

  handleChange(e) {
    // when dropdown value changes, it updates serviceQuery to that value
    // which will then make the call to the yelp API for services
    // related to that service
    this.setState({
      // we first set the state to the service we're searching
      serviceQuery: e.target.value
    }, () => {
      // then we call our function that gets yelp services above
      this.getYelpServices()
    }) 
  }

  handleMouseEnter (i, e) {
    // when we hover over a service on our page, we set the itemHovered
    // value in state to that business
    // this is used to make the markers on the map bounce when we hover
    // over them
    this.setState({
      itemHovered: i
    }, ()=>{
      // console.log('mouse Enter new state: ', this.state.itemHovered)
    })
  }

  handleMouseLeave(i, e) {
    // for react, I don't think you can use onMouseHover, so instead
    // mouse entering and mouse leaving need to be separate functions
    // this function resets the state value of itemHovered to null
    // when the mouse stops hovering over a business in the list, 
    // and the marker therefore stops bouncing
    this.setState({
      itemHovered: null
    },() =>{
      // console.log('mouse leave new state: ', this.state.itemHovered)
    })
  }

  render () {
    var mapComponent;
    if (this.state.map) {
      // this if statement is conditional rendering, so that the map will only show
      // when we have services to show
      // this is done by creating a variable mapComponent that will either be null
      // or the actual map component

      // i don't exactly know what the loading element is but i don't think it works without it
      // the height of the container element is what is used to align it with the height of the service
          // list right next to the map
      mapComponent = 
              <GoogleMaps 
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDu_83xpevHdDbkGIRm_wbY-6MtIT_b2cg&v=3.exp&libraries=geometry,drawing,places"
          
          loadingElement={<div style={{ height: `100%` }} />}
          
          containerElement={<div style={{ height: `100%`}} />}
          mapElement={<div style={{ height: `100%` }}/>}
          businesses={this.state.YelpList}
          hovered={this.state.itemHovered}
          />
    } else {
      mapComponent = null
    } 

          /* the list of search queries is essentially hard coded 
          so that you can't really modify it dynamically.  this could be a good thing to work on
          if you want to give the option to users to add different search queries
          we decided against it because we wanted to only provided services that were specific to 
          our app's scope, which is related to moving
            */

    return (
    <div className="dropdowns">
   
      <form type="submit" value="Submit" >
        <select value={this.state.serviceQuery} onChange={this.handleChange.bind(this)} >
  
          <option value ="movers"> Movers </option>
          <option value ="supplies"> Supplies </option>
          <option value ="truck rental"> Truck rental </option>
          <option value ="storage"> Storage </option>
        </select>
      </form>
      <div className="services">
        {this.state.YelpList.map((business, i) => {
          var letter =  String.fromCharCode(65 + i);
            return <YelpListItem
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}  
            key={business.name} 
            business={business} 
            letter={letter}
            index={i}
             />
          }
        )}
      </div>
      <div className="map">
      {mapComponent}
      </div>
    </div>
    )
  }
}

export default YelpList;



