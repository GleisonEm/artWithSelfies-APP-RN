import api from './api';

export default class Main {
	static async getArts() {
		return api
			.get('/arts')
			.then(async (response) => {
					return {
						arts: response.data.arts,
						ok: true,
					};
			})
			.catch((error) => ({
				ok: false,
				message: 'Não foi possivel obter as obras de artes!',
			}));
	}
}
