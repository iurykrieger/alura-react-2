import { List } from 'immutable';

export function timeline(state = new List(), action) {
	switch (action.type) {
		case 'LOAD': {
			return new List(action.photos);
		}
		case 'COMMENT': {
			const index = state.findIndex(photo => photo.id === action.photoId);
			const photo = state.get(index);
			const comments = photo.comentarios.concat(action.comment);
			return state.set(index, Object.assign({}, photo, { comentarios: comments }));
		}
		case 'LIKE': {
			const index = state.findIndex(photo => photo.id === action.photoId);
			const photo = state.get(index);
			let likers;
			if (photo.likers.find(liker => liker.login === action.liker.login)) {
				likers = photo.likers.filter(liker => liker.login !== action.liker.login);
			} else {
				likers = photo.likers.concat(action.liker);
			}
			return state.set(index, Object.assign({}, photo, { likers, likeada: !photo.likeada }));
		}
		default: {
			return state;
		}
	}
}

export function notify(state = '', action) {
	switch (action.type) {
		case 'ALERT':
			return action.message;
		default:
			return state;
	}
}
