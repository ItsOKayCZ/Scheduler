import axios from 'axios';

const api = axios.create({
	baseURL: process.env._AXIOS_BASE_URL_
});

// Categories
api.createCategory = async function(category){
	return await this.post('/api/createCategory', category);
};
api.loadCategories = async function(){
	return await this.post('/api/getCategories');
}

// Events
api.createEvent = async function(event){
	return await this.post('/api/createEvent', event);
}
api.getEvents = async function(){
	return await this.post('/api/getEvents');
}

export default api;