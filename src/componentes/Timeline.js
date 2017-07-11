import React, { Component } from 'react';
import Foto from './Foto';

export default class Timeline extends Component {
	constructor() {
		super();
		this.state = { fotos: [] };
	}

	componentDidMount() {
		fetch(`http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('x-access-token')}`)
			.then(fotos => fotos.json())
			.then(fotos => {
				this.setState({ fotos: fotos });
				console.log(fotos);
			});
	}

	render() {
		return (
			<div className="fotos container">
				{this.state.fotos.map(foto => <Foto foto={foto} key={foto.id} />)}
			</div>
		);
	}
}
