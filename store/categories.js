import api from "~/plugins/api";

export const state = () => ({
	data: []
});

export const mutations = {
	async addCategory(state, category){
		const res = await api.createCategory(category);

		this.commit('categories/pushCategory', res.data.category);
	},
	async removeCategory(state, category){
		const res = await api.removeCategory(category);

		this.commit('categories/setCategories', res.data.categories);
	},

	pushCategory(state, category){
		state.data.push(category);
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