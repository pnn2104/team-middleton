import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TaskList from './TaskList.jsx';
import YelpList from './YelpList.jsx';
import Community from './Community.jsx';

const Moving = (props) => (
  <Router>
    <div className="navbar">
      <ul>
        <li>
          <Link to="/">Tasks</Link>
        </li>
        <li>
          <Link to="/service">Services</Link>
        </li>
        <li>
          <Link to="/community">Community</Link>
        </li>
      </ul>
      <button id="logout" onClick={props.logout}>Log Out</button>
      <Route exact path="/" component={TaskList}/>
      <Route path="/service" component={YelpList} />
      <Route path="/community" component={Community} />

    </div>
  </Router>
);

export default Moving;

//Browser router! Note that the exact path is needed to keep the router on the right track - otherwise it gets confused, since there's no dedicated homepage.