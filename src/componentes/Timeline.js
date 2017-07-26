import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import Photo from './Photo';
import Header from './Header';
import TimelineStore from '../stores/TimelineStore';

const store = new TimelineStore();

export default class Timeline extends Component {
	constructor(props) {
		super(props);
		this.login = this.props.match.params.login;
		this.state = { photos: [] };
	}

	like(photoId) {
		return store.like(photoId);
	}

	comment(photoId, comment) {
		return store.comment(photoId, comment);
	}

	componentWillMount() {
		store.subscribe(photos => this.setState({ photos }));
	}

	componentDidMount() {
		store.loadPhotos(this.login);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.login !== nextProps.match.params.login) {
			this.login = nextProps.match.params.login;
			this.props.store.loadPhotos(this.props.login);
		}
	}

	render() {
		if (!this.login && !localStorage.getItem('x-access-token')) {
			return <Redirect to="/" />;
		} else {
			return (
				<div id="root">
					<div className="main">
						<Header store={store} />
						<div className="fotos container">
							<ReactCSSTransitionGroup
								transitionName="timeline"
								transitionEnterTimeout={500}
								transitionLeaveTimeout={500}
							>
								{this.state.photos.map(photo =>
									<Photo
										photo={photo}
										key={photo.id}
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
