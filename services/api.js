import axios from "axios";

const api = axios.create({
	// baseURL: 'http://192.168.0.106:8004',
	baseURL: 'http://167.99.54.80:8043',
	headers: {
		'authorization-token': 'version1-teste',
	},
});


export default api;
