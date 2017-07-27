import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Photo from './Photo';
import Header from './Header';
import TimelineApi from '../stores/TimelineApi';
import { createStore, applyMiddleware } from 'redux';
import { timeline } from '../reducers/timeline';
import thunkMiddleware from 'redux-thunk';

const store = createStore(timeline, applyMiddleware(thunkMiddleware));

export default class Timeline extends Component {
	constructor(props) {
		super(props);
		this.login = this.props.match.params.login;
		this.state = { photos: [] };
	}

	load(login) {
		return store.dispatch(TimelineApi.load(login));
	}

	search(searchValue) {
		return store.dispatch(TimelineApi.search(searchValue));
	}

	like(photoId) {
		return store.dispatch(TimelineApi.like(photoId));
	}

	comment(photoId, comment) {
		return store.dispatch(TimelineApi.comment(photoId, comment));
	}

	componentWillMount() {
		store.subscribe(() => this.setState({ photos: store.getState() }));
	}

	componentDidMount() {
		this.load(this.login);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.login !== nextProps.match.params.login) {
			this.login = nextProps.match.params.login;
			this.load(this.login);
		}
	}

	render() {
		if (!this.login && !localStorage.getItem('x-access-token')) {
			return <Redirect to="/" />;
		} else {
			return (
				<div id="root">
					<div className="main">
						<Header search={this.search.bind(this)} />
						<div className="fotos container">
							{this.state.photos.map(photo =>
								<Photo
									photo={photo}
									key={photo.id}
									like={this.like.bind(this)}
									comment={this.comment.bind(this)}
								/>
							)}
						</div>
					</div>
				</div>
			);
		}
	}
}
