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
api.removeCategory = async function(category){
	return await this.post('/api/removeCategory', category);
}

// Events
api.createEvent = async function(event){
	return await this.post('/api/createEvent', event);
}
api.getEvents = async function(){
	return await this.post('/api/getEvents');
}
api.removeEvent = async function(event){
	return await this.post('/api/removeEvent', event);
}

export default api;