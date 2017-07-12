import React, { Component } from 'react';
import Foto from './Foto';
import Header from './Header';
import { Redirect } from 'react-router-dom';

export default class Timeline extends Component {
	constructor(props) {
		super(props);
		this.state = { fotos: [] };
		this.login = this.props.match.params.login;
	}

	load() {
		let url = 'http://10.1.1.29:8080/api';
		if (!this.login) {
			url = `${url}/fotos?X-AUTH-TOKEN=${localStorage.getItem('x-access-token')}`;
		} else {
			url = `${url}/public/fotos/${this.login}`;
		}
		fetch(url).then(fotos => fotos.json()).then(fotos => this.setState({ fotos: fotos }));
	}

	componentDidMount() {
		this.load();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.login != nextProps.match.params.login) {
			this.login = nextProps.match.params.login;
			this.load();
		}
	}

	render() {
		if (!this.login && !localStorage.getItem('x-access-token')) {
			return <Redirect to="/" />;
		} else {
			return (
				<div id="root">
					<div className="main">
						<Header />
						<div className="fotos container">
							{this.state.fotos.map(foto => <Foto foto={foto} key={foto.id} />)}
						</div>
					</div>
				</div>
			);
		}
	}
}
