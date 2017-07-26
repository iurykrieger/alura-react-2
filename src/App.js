import React, { Component } from 'react';
import Timeline from './componentes/Timeline';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './componentes/Login';
import Logout from './componentes/Logout';

export default class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route exact path="/" component={Login} />
					<Route path="/timeline/:login" component={Timeline} />
					<Route path="/timeline" component={Timeline} />
					<Route paht="/logout" component={Logout} />
				</Switch>
			</Router>
		);
	}
}
