import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FotoActions extends Component {
	like(event) {
		event.preventDefault();
		this.props.like(this.props.photo.id);
	}

	comment(event) {
		event.preventDefault();
		this.props
			.comment(this.props.photo.id, this.commentInput.value)
			.then(() => (this.commentInput.value = ''));
	}

	render() {
		return (
			<section className="fotoAtualizacoes">
				<a
					onClick={this.like.bind(this)}
					className={
						this.props.photo.likeada
							? 'fotoAtualizacoes-like-ativo'
							: 'fotoAtualizacoes-like'
					}
				>
					Likar
				</a>
				<form className="fotoAtualizacoes-form" onSubmit={this.comment.bind(this)}>
					<input
						type="text"
						placeholder="Adicione um comentário..."
						className="fotoAtualizacoes-form-campo"
						ref={input => (this.commentInput = input)}
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

class PhotoInfo extends Component {
	render() {
		return (
			<div className="foto-info">
				<div className="foto-info-likes">
					{this.props.photo.likers.map(liker =>
						<Link key={liker.login} to={`/timeline/${liker.login}`}>
							{' '}{liker.login},
						</Link>
					)}{' '}
					curtiram
				</div>

				<p className="foto-info-legenda">
					<Link
						to={`/timeline/${this.props.photo.loginUsuario}`}
						className="foto-info-autor"
					>
						{this.props.photo.loginUsuario}
					</Link>{' '}
					{this.props.photo.comentario}
				</p>

				<ul className="foto-info-comentarios">
					{this.props.photo.comentarios.map(comment =>
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

class PhotoHeader extends Component {
	render() {
		return (
			<header className="foto-header">
				<figure className="foto-usuario">
					<img src={this.props.photo.urlPerfil} alt="foto do usuario" />
					<figcaption className="foto-usuario">
						<Link to={`/timeline/${this.props.photo.loginUsuario}`}>
							{this.props.photo.loginUsuario}
						</Link>
					</figcaption>
				</figure>
				<time className="foto-data">
					{this.props.photo.horario}
				</time>
			</header>
		);
	}
}

export default class Photo extends Component {
	render() {
		return (
			<div className="foto">
				<PhotoHeader photo={this.props.photo} />
				<img alt="foto" className="foto-src" src={this.props.photo.urlFoto} />
				<PhotoInfo photo={this.props.photo} />
				<FotoActions {...this.props} />
			</div>
		);
	}
}
