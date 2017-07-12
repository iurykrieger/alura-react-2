import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ErrorHandler from '../helpers/ErrorHandler';
import Pubsub from 'pubsub-js';

export default class Header extends Component {
	search(event) {
		event.preventDefault();
		fetch(`http://10.1.1.29:8080/api/public/fotos/${this.searchInput.value}`)
			.then(response => ErrorHandler.handle(response).json())
			.then(photos => Pubsub.publish('new-photos', photos));
	}

	render() {
		return (
			<header className="header container">
				<Link to="/timeline">
					<h1 className="header-logo">Instalura</h1>
				</Link>

				<form className="header-busca" onSubmit={this.search.bind(this)}>
					<input
						type="text"
						name="search"
						placeholder="Pesquisa"
						className="header-busca-campo"
						ref={input => (this.searchInput = input)}
					/>
					<input type="submit" value="Buscar" className="header-busca-submit" />
				</form>

				<nav>
					<ul className="header-nav">
						<li className="header-nav-item">
							<a href="#">
								♡
								{/*                 ♥ */}
								{/* Quem deu like nas minhas fotos */}
							</a>
						</li>
					</ul>
				</nav>
			</header>
		);
	}
}
