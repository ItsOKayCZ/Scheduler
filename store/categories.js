import api from "~/services/api";

export const state = () => ({
	data: []
});

export const mutations = {
	async addCategory(state, category){
		const res = await api.createCategory(category);

		this.commit('categories/pushCategory', res.data.category);
	},
	async removeCategory(state, category){ // TODO: Send ID of category to API
		console.log(category);

		// state.data = state.data.filter(c => c.title != categoryTitle);
	},

	pushCategory(state, category){
		state.data.push(category); // TODO: Instead push event from respond with id
	},
	setCategories(state, categories){
		state.data = categories;
	}
};

export const actions = {
	async load(state){
		const res = await api.loadCategories();
		const categories = res.data.categories;

		state.commit('setCategories', categories);
	}
};