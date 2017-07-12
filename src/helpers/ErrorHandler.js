export default class ErrorHandler {
	static handle(response) {
		if (!response.ok) {
			throw response;
		}
		return response;
	}
}
