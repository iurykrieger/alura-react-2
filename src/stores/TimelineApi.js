import ErrorHandler from '../helpers/ErrorHandler';
import ActionCreator from '../actions/ActionCreator';

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
				.then(photos => dispatch(ActionCreator.load(photos)))
				.catch(error => console.log(error));
	}

	static search(searchValue) {
		return dispatch =>
			fetch(`http://10.1.1.29:8080/api/public/fotos/${searchValue}`)
				.then(response => ErrorHandler.handle(response).json())
				.then(photos => {
					if (photos.length !== 0) {
						dispatch(ActionCreator.load(photos));
						dispatch(ActionCreator.alert(''));
					} else {
						dispatch(ActionCreator.alert('Usuário não encontrado :('));
					}
				})
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
				.then(liker => dispatch(ActionCreator.like(photoId, liker)))
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
				.then(comment => dispatch(ActionCreator.comment(photoId, comment)))
				.catch(error => console.log(error));
	}

	static login() {
		fetch(`http://10.1.1.240:8080/api/authenticate`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				name: 'patrick',
				password: '123456'
			})
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(response => localStorage.setItem('token', response.token))
			.catch(error => console.log(error));
	}

	static getUsers() {
		fetch(`http://10.1.1.240:8080/api/users`, {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
				'x-access-token': localStorage.getItem('token')
			}
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(users => console.log(users))
			.catch(error => console.log(error));
	}
}
