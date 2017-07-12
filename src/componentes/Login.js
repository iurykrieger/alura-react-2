import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
	constructor() {
		super();
		this.state = { errorMessage: '', token: '' };
	}

	_handleError(response) {
		if (!response.ok) {
			console.log(response.statusText);
			throw new Error('Não foi possível fazer o login.');
		}
		return response.text();
	}

	onSubmit(event) {
		event.preventDefault();
		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({
				login: this.login.value,
				senha: this.senha.value
			}),
			headers: new Headers({ 'Content-type': 'application/json' })
		};

		fetch('http://10.1.1.29:8080/api/public/login', requestInfo)
			.then(response => this._handleError(response))
			.then(token => {
				localStorage.setItem('x-access-token', token);
				this.setState({ errorMessage: '' });
			})
			.catch(error => this.setState({ errorMessage: error.message }));
	}

	render() {
		if (localStorage.getItem('x-access-token')) {
			return <Redirect to="/timeline" />;
		} else {
			return (
				<div className="login-box">
					<h1 className="header-logo">Instalura</h1>
					<span>
						{this.state.errorMessage}
					</span>
					<form method="post" onSubmit={this.onSubmit.bind(this)}>
						<input type="text" ref={input => (this.login = input)} />
						<input type="password" ref={input => (this.senha = input)} />
						<input type="submit" value="Login" />
					</form>
				</div>
			);
		}
	}
}
