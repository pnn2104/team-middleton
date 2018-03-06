import React, {Component} from 'react';
//import Weather from './Weather.js';
import moment from 'moment';

class Countdown extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    // TODO: ZIP can be obtained from user model
    this.state = {
      edit: true,
      date: null,
      countdownString: '',
      //zip: '',
      //weatherData: null,
    };
  }

  // Submit zip and date.
  // TODO: zip -> weather API data
  handleSubmit(ev) {
    ev.preventDefault();
    if (ev.target.value === 'Edit') {
      this.setState({edit: true, date: ''});
    } else {
      // date -> humanized countdown date string.
      let currentDate = moment();
      let targetDate = moment(this.state.date);
      let differenceDate = moment.duration(currentDate.diff(targetDate));
      let countdownString = differenceDate.humanize();
      this.setState({
        date: '',
        countdownString,
        edit: false,
        //displayWeather: true,
      });
    }
  }

  render() {
    return (
      <div style={{borderRadius: '2px'}}>
        {this.state.edit ? (
          <div>
            {/*<input
              placeholder="zip"
              type="text"
              onChange={ev => this.setState({zip: ev.target.value})}
            />*/}
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
            <input type="submit" value="Edit" onClick={this.handleSubmit} />
          </div>
        )}
      </div>
    );
  }
}

export default Countdown;
