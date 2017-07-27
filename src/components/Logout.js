import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Logout extends Component {
	componentWillMount() {
		localStorage.removeItem('x-access-token');
	}
 
	render() {
		return <Redirect to="/" />;
	}
}
