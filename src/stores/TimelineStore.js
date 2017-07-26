import ErrorHandler from '../helpers/ErrorHandler';
import Pubsub from 'pubsub-js';

export default class TimelineStore {
	constructor(photos) {
		this.photos = photos;
	}

	loadPhotos(login) {
		let url = 'http://10.1.1.29:8080/api';
		if (!login) {
			url = `${url}/fotos?X-AUTH-TOKEN=${localStorage.getItem('x-access-token')}`;
		} else {
			url = `${url}/public/fotos/${login}`;
		}
		fetch(url).then(response => ErrorHandler.handle(response).json()).then(photos => {
			this.photos = photos;
			Pubsub.publish('timeline', this.photos);
		});
	}

	search(searchValue) {
		fetch(`http://10.1.1.29:8080/api/public/fotos/${searchValue}`)
			.then(response => ErrorHandler.handle(response).json())
			.then(photos => {
				this.photos = photos;
				Pubsub.publish('timeline', this.photos);
			});
	}

	like(photoId) {
		return fetch(`http://10.1.1.29:8080/api/fotos/${photoId}/like`, {
			method: 'POST',
			headers: {
				'X-AUTH-TOKEN': localStorage.getItem('x-access-token')
			}
		})
			.then(response => ErrorHandler.handle(response).json())
			.then(liker => {
				const photo = this._findPhoto(photoId);
				if (photo.likers.find(actualLiker => actualLiker.login === liker.login)) {
					photo.likers = photo.likers.filter(
						actualLiker => actualLiker.login !== liker.login
					);
				} else {
					photo.likers.push(liker);
				}
				photo.likeada = !photo.likeada;
				Pubsub.publish('timeline', this.photos);
			})
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
			.then(comment => {
				this._findPhoto(photoId).comentarios.push(comment);
				Pubsub.publish('timeline', this.photos);
			})
			.catch(error => console.log(error));
	}

	_findPhoto(photoId) {
		return this.photos.find(photo => photo.id === photoId);
	}

	subscribe(callback) {
		Pubsub.subscribe('timeline', (topic, photos) => callback(photos));
	}
}
