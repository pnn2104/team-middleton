import React, {Component} from 'react';
//import Weather from './Weather.js';
import moment from 'moment';
import axios from 'axios';

class Countdown extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateWeather = this.updateWeather.bind(this);
    this.updateCountdown = this.updateCountdown.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.persistData = this.persistData.bind(this);

    this.state = {
      edit: false,
      user: '',
      moveoutday: null,
      lat: null,
      lng: null,
      location: '',
      countdownString: '',
      weatherData: null,
    };
  }

  // Submit location and moveoutday.
  handleSubmit(ev) {
    ev.preventDefault();
    if (ev.target.value === 'Edit') {
      axios.delete('/movingInfo', { params: {user: this.state.user} });
      this.setState({edit: true, moveoutday: '', location: ''});
    } else {
      let targetDate = moment(this.state.moveoutday);
      // Get the geocoder information
      this.getCoordinates(coordinates => {
        console.log('1 GEtting cooridngates');
        const {lat, lng} = coordinates;
        this.setState({lat, lng, edit: false}, () => {
          console.log('2 setting state')
          this.persistData(data => {
            console.log('3 persisting data')
            this.updateCountdown(targetDate, () => {
              console.log('4 persisting data');
              this.updateWeather();
            });
          });
        });
      });
    }
  }

  getCoordinates(callback) {
    axios.post('/geocoder', {location: this.state.location}).then(results => {
      callback(results.data);
    });
  }

  updateWeather() {
    axios
      .post('/weather', {
        dateInUnix: moment(this.state.moveoutday).unix(),
        lat: this.state.lat,
        lng: this.state.lng,
      })
      .then(results => {
        console.log(results)
        this.setState({weatherData: results.data.currently.summary})
      });
  }

  persistData(callback) {
    axios.post('/widget', {
      user: this.state.user,
      moveoutday: this.state.moveoutday,
      lat: this.state.lat,
      lng: this.state.lng,
      location: this.state.location,
    }).then(results => callback(results));
  }

  updateCountdown(targetDate, cb) {
    let currentDate = moment();
    let differenceDate = moment.duration(currentDate.diff(targetDate));
    let countdownString = differenceDate.humanize();
    this.setState({
      countdownString,
      edit: false,
    }, cb);
  }

  componentWillMount() {
    // Once the comp is mounted, we need to check if the use has already given
    // us their location and moveoutday.
    this.setState({user: JSON.parse(sessionStorage.getItem('user'))}, () => {
      console.log(`[componentWillMount] this.state.user: ${this.state.user}`);
      axios.post('/movingInfo', {user: this.state.user}).then(results => {
        console.log('results from call to /movingInfo', results.data);
        if (results.data.length === 0) {
          // No data persisted, so initialize in edit mode
          this.setState({edit: true});
        } else {
          const {user, moveoutday, lat, lng, location} = results.data[0];
          let targetDate = moment(moveoutday);
          console.log(`[componentWillMount] moveoutday: ${moveoutday}`);
          console.log(`[componentWillMount] lat: ${lat}`);
          this.updateCountdown(targetDate);
          this.setState({user, moveoutday, lat, lng, location}, () => {
            this.updateWeather();
          });
        }
      });
    });
  }

  render() {
    return (
      <div style={{borderRadius: '2px'}}>
        {this.state.edit ? (
          <div>
            <input
              placeholder="location"
              type="text"
              onChange={ev => this.setState({location: ev.target.value})}
            />
            <input
              placeholder="Move out Day"
              type="text"
              onChange={ev => this.setState({moveoutday: ev.target.value})}
            />
            <input type="submit" value="Button" onClick={this.handleSubmit} />
          </div>
        ) : (
          <div>
            <h4>{this.state.countdownString}</h4>
            <h4>Weather will be {this.state.weatherData}</h4>
            <input type="submit" value="Edit" onClick={this.handleSubmit} />
          </div>
        )}
      </div>
    );
  }
}

export default Countdown;
