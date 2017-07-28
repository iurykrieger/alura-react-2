export default class ActionCreator {
	static load(photos) {
		return { type: 'LOAD', photos };
	}

	static like(photoId, liker) {
		return { type: 'LIKE', photoId, liker };
	}

	static comment(photoId, comment) {
		return { type: 'COMMENT', photoId, comment };
	}

	static alert(message) {
		return { type: 'ALERT', message };
	}
}
