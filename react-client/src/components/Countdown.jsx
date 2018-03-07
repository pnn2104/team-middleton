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

    // TODO: ZIP can be obtained from user model
    this.state = {
      edit: true,
      date: null,
      countdownString: '',
      zip: '',
      weatherData: null,
    };
  }

  // Submit zip and date.
  // TODO: zip -> weather API data
  handleSubmit(ev) {
    ev.preventDefault();
    if (ev.target.value === 'Edit') {
      this.setState({edit: true, date: ''});
    } else {
      let targetDate = moment(this.state.date);
      this.updateCountdown(targetDate);
      this.updateWeather(targetDate);
    }
  }

  updateCountdown(targetDate) {
    // date -> humanized countdown date string.
    let currentDate = moment();
    let differenceDate = moment.duration(currentDate.diff(targetDate));
    let countdownString = differenceDate.humanize();
    this.setState({
      date: '',
      countdownString,
      edit: false,
    });
  }

  updateWeather(date) {
    //const isoDateString = date.toISOString();
    const dateInUnix = date.unix();
    axios.post('/geocoder', {zip: this.state.zip}).then(results =>
      axios
        .post('/weather', {
          dateInUnix,
          lat: results.data.lat,
          lng: results.data.lng,
        })
        .then(results =>
          this.setState({weatherData: results.data.currently.summary}),
        ),
    );
  }

  render() {
    return (
      <div style={{borderRadius: '2px'}}>
        {this.state.edit ? (
          <div>
            <input
              placeholder="zip"
              type="text"
              onChange={ev => this.setState({zip: ev.target.value})}
            />
            <input
              placeholder="date"
              type="text"
              onChange={ev => this.setState({date: ev.target.value})}
            />
            <input type="submit" value="Button" onClick={this.handleSubmit} />
          </div>
        ) : (
          <div>
            <h3>{this.state.countdownString}</h3>
            <h3>Weather will be {this.state.weatherData}</h3>
            <input type="submit" value="Edit" onClick={this.handleSubmit} />
          </div>
        )}
      </div>
    );
  }
}

export default Countdown;
