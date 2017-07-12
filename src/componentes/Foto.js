import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Pubsub from 'pubsub-js';
import ErrorHandler from '../helpers/ErrorHandler';

class FotoAtualizacoes extends Component {
	constructor(props) {
		super(props);
		this.state = { liked: this.props.foto.likeada };
	}

	like(event) {
		event.preventDefault();
		fetch(`http://10.1.1.29:8080/api/fotos/${this.props.foto.id}/like`, {
			method: 'POST',
			headers: {
				'X-AUTH-TOKEN': localStorage.getItem('x-access-token')
			}
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(liker => {
				this.setState({ liked: !this.state.liked });
				Pubsub.publish('refresh-liker', { id: this.props.foto.id, liker });
			})
			.catch(error => console.log(error));
	}

	comenta(event) {
		event.preventDefault();
		fetch(`http://10.1.1.29:8080/api/fotos/${this.props.foto.id}/comment`, {
			method: 'POST',
			headers: {
				'X-AUTH-TOKEN': localStorage.getItem('x-access-token'),
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				texto: this.comment.value
			})
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(comment => {
				Pubsub.publish('new-comment', { id: this.props.foto.id, comment });
				this.comment.value = '';
			})
			.catch(error => console.log(error));
	}

	render() {
		return (
			<section className="fotoAtualizacoes">
				<a
					onClick={this.like.bind(this)}
					className={
						this.state.liked ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'
					}
				>
					Likar
				</a>
				<form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
					<input
						type="text"
						placeholder="Adicione um comentário..."
						className="fotoAtualizacoes-form-campo"
						ref={input => (this.comment = input)}
					/>
					<input
						type="submit"
						value="Comentar!"
						className="fotoAtualizacoes-form-submit"
					/>
				</form>
			</section>
		);
	}
}

class FotoInfo extends Component {
	constructor(props) {
		super(props);
		this.state = { likers: this.props.foto.likers, comments: this.props.foto.comentarios };
	}

	componentWillMount() {
		Pubsub.subscribe('refresh-liker', (topic, likerInfo) => {
			if (likerInfo.id == this.props.foto.id) {
				if (this.state.likers.find(liker => liker.login == likerInfo.liker.login)) {
					this.setState({
						likers: this.state.likers.filter(
							liker => liker.login != likerInfo.liker.login
						)
					});
				} else {
					this.setState({
						likers: this.state.likers.concat(likerInfo.liker)
					});
				}
			}
		});
		Pubsub.subscribe('new-comment', (topic, commentInfo) => {
			if (commentInfo.id == this.props.foto.id) {
				this.setState({ comments: this.state.comments.concat(commentInfo.comment) });
			}
		});
	}

	render() {
		return (
			<div className="foto-info">
				<div className="foto-info-likes">
					{this.state.likers.map(liker =>
						<Link key={liker.login} to={`/timeline/${liker.login}`}>
							{liker.login}
						</Link>
					)}{' '}
					curtiram
				</div>

				<p className="foto-info-legenda">
					<Link
						to={`/timeline/${this.props.foto.loginUsuario}`}
						className="foto-info-autor"
					>
						{this.props.foto.loginUsuario}
					</Link>{' '}
					{this.props.foto.comentario}
				</p>

				<ul className="foto-info-comentarios">
					{this.state.comments.map(comment =>
						<li className="comentario" key={comment.id}>
							<Link
								key={comment.login}
								to={`/timeline/${comment.login}`}
								className="foto-info-autor"
							>
								{comment.login}
							</Link>{' '}
							{comment.texto}
						</li>
					)}
				</ul>
			</div>
		);
	}
}

class FotoHeader extends Component {
	render() {
		return (
			<header className="foto-header">
				<figure className="foto-usuario">
					<img src={this.props.foto.urlPerfil} alt="foto do usuario" />
					<figcaption className="foto-usuario">
						<Link to={`/timeline/${this.props.foto.loginUsuario}`}>
							{this.props.foto.loginUsuario}
						</Link>
					</figcaption>
				</figure>
				<time className="foto-data">
					{this.props.foto.horario}
				</time>
			</header>
		);
	}
}

export default class Foto extends Component {
	render() {
		return (
			<div className="foto">
				<FotoHeader foto={this.props.foto} />
				<img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
				<FotoInfo foto={this.props.foto} />
				<FotoAtualizacoes foto={this.props.foto} />
			</div>
		);
	}
}
