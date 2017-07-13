import React, { Component } from 'react';
import Foto from './Foto';
import Header from './Header';
import { Redirect } from 'react-router-dom';
import ErrorHandler from '../helpers/ErrorHandler';
import Pubsub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Timeline extends Component {
	constructor(props) {
		super(props);
		this.state = { fotos: [] };
		this.login = this.props.match.params.login;
	}

	loadPhotos() {
		let url = 'http://10.1.1.29:8080/api';
		if (!this.login) {
			url = `${url}/fotos?X-AUTH-TOKEN=${localStorage.getItem('x-access-token')}`;
		} else {
			url = `${url}/public/fotos/${this.login}`;
		}
		fetch(url)
			.then(response => ErrorHandler.handle(response).json())
			.then(photos => this.setState({ fotos: photos }));
	}

	like(photoId) {
		return fetch(`http://10.1.1.29:8080/api/fotos/${photoId}/like`, {
			method: 'POST',
			headers: {
				'X-AUTH-TOKEN': localStorage.getItem('x-access-token')
			}
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(liker => Pubsub.publish('refresh-liker', { photoId, liker }))
			.catch(error => console.log(error));
	}

	comment(photoId, comment) {
		return fetch(`http://10.1.1.29:8080/api/fotos/${photoId}/comment`, {
			method: 'POST',
			headers: {
				'X-AUTH-TOKEN': localStorage.getItem('x-access-token'),
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				texto: comment
			})
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(comment => Pubsub.publish('new-comment', { photoId, comment }))
			.catch(error => console.log(error));
	}

	componentWillMount() {
		Pubsub.subscribe('new-photos', (topic, photos) => this.setState({ fotos: photos }));
		Pubsub.subscribe('refresh-liker', (topic, likerInfo) => {
			const photo = this.state.fotos.find(photo => photo.id == likerInfo.photoId);
			if (photo.likers.find(liker => liker.login === likerInfo.liker.login)) {
				photo.likers = photo.likers.filter(liker => liker.login != likerInfo.liker.login);
			} else {
				photo.likers.push(likerInfo.liker);
			}
			this.setState({ fotos: this.state.fotos });
		});
		Pubsub.subscribe('new-comment', (topic, commentInfo) => {
			const photo = this.state.fotos.find(photo => photo.id == commentInfo.photoId);
			photo.comentarios.push(commentInfo.comment);
			this.setState({ fotos: this.state.fotos });
		});
	}

	componentDidMount() {
		this.loadPhotos();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.login != nextProps.match.params.login) {
			this.login = nextProps.match.params.login;
			this.loadPhotos();
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
							<ReactCSSTransitionGroup
								transitionName="timeline"
								transitionEnterTimeout={500}
								transitionLeaveTimeout={500}
							>
								{this.state.fotos.map(foto =>
									<Foto
										foto={foto}
										key={foto.id}
										like={this.like.bind(this)}
										comment={this.comment.bind(this)}
									/>
								)}
							</ReactCSSTransitionGroup>
						</div>
					</div>
				</div>
			);
		}
	}
}
