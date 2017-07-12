import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import Timeline from './componentes/Timeline';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path="/" component={Login} />
			<Route path="/timeline/:login" component={Timeline} />
			<Route path="/timeline" component={Timeline} />
			<Route paht="/logout" component={Logout} />
		</Switch>
	</Router>,
	document.getElementById('root')
);
