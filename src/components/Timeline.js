import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Photo from './Photo';
import Header from './Header';
import TimelineApi from '../stores/TimelineApi';
import { connect } from 'react-redux';

class Timeline extends Component {
	constructor(props) {
		super(props);
		this.login = this.props.match.params.login;
	}

	componentDidMount() {
		this.props.load(this.login);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.login !== this.login) {
			this.login = nextProps.match.params.login;
			this.props.load(this.login);
		}
	}

	render() {
		console.log("render");
		if (!this.login && !localStorage.getItem('x-access-token')) {
			return <Redirect to="/" />;
		} else {
			return (
				<div id="root">
					<div className="main">
						<Header search={this.props.search} />
						<div className="fotos container">
							{this.props.photos.map(photo =>
								<Photo
									photo={photo}
									key={photo.id}
									like={this.props.like}
									comment={this.props.comment}
								/>
							)}
						</div>
					</div>
				</div>
			);
		}
	}
}

const mapStateToProps = state => {
	return { photos: state.timeline };
};

const mapDispatchToProps = dispatch => {
	return {
		like: photoId => dispatch(TimelineApi.like(photoId)),
		load: login => dispatch(TimelineApi.load(login)),
		search: searchValue => dispatch(TimelineApi.search(searchValue)),
		comment: (photoId, comment) => dispatch(TimelineApi.comment(photoId, comment))
	};
};

const TimelineContainer = connect(mapStateToProps, mapDispatchToProps)(Timeline);

export default TimelineContainer;
