import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
	search(event) {
		event.preventDefault();
		this.props.store.search(this.searchInput.value);
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
