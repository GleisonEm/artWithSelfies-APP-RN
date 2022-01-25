import api from './api';

export default class Upload {
	static async getImageIA(data) {
		return api
			.post('/upload/', data)
			.then(async (resp) => {
				return {
					ok: true,
					imageLink: resp.data.link,
					message: resp.data.message || 'Erro',
				};
			})
			.catch((error) => {
				return {
					ok: false,
					message: error || 'Não foi possivel obter a imagem',
				};
			});
	}
}
