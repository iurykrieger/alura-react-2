export function timeline(state = [], action) {
	switch (action.type) {
		case 'LOAD':
			return action.photos;
		case 'COMMENT':
			state.find(photo => photo.id === action.photoId).comentarios.push(action.comment);
			return state;
		case 'LIKE':
			const photo = state.find(photo => photo.id === action.photoId);
			if (photo.likers.find(actualLiker => actualLiker.login === action.liker.login)) {
				photo.likers = photo.likers.filter(
					actualLiker => actualLiker.login !== action.liker.login
				);
			} else {
				photo.likers.push(action.liker);
			}
			photo.likeada = !photo.likeada;
			return state;
		default:
			return state;
	}
}
