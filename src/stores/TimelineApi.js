import ErrorHandler from '../helpers/ErrorHandler';

export default class TimelineApi {
	static load(login) {
		let url = 'http://10.1.1.29:8080/api';
		if (!login) {
			url = `${url}/fotos?X-AUTH-TOKEN=${localStorage.getItem('x-access-token')}`;
		} else {
			url = `${url}/public/fotos/${login}`;
		}
		return dispatch =>
			fetch(url)
				.then(response => ErrorHandler.handle(response).json())
				.then(photos => dispatch({ type: 'LOAD', photos }))
				.catch(error => console.log(error));
	}

	static search(searchValue) {
		return dispatch =>
			fetch(`http://10.1.1.29:8080/api/public/fotos/${searchValue}`)
				.then(response => ErrorHandler.handle(response).json())
				.then(photos => dispatch({ type: 'SEARCH', photos }))
				.catch(error => console.log(error));
	}

	static like(photoId) {
		return dispatch =>
			fetch(`http://10.1.1.29:8080/api/fotos/${photoId}/like`, {
				method: 'POST',
				headers: {
					'X-AUTH-TOKEN': localStorage.getItem('x-access-token')
				}
			})
				.then(response => ErrorHandler.handle(response).json())
				.then(liker => dispatch({ type: 'LIKE', photoId, liker }))
				.catch(error => console.log(error));
	}

	static comment(photoId, comment) {
		return dispatch =>
			fetch(`http://10.1.1.29:8080/api/fotos/${photoId}/comment`, {
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
				.then(comment => dispatch({ type: 'COMMENT', photoId, comment }))
				.catch(error => console.log(error));
	}
}
