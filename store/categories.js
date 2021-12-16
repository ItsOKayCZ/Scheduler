import api from "~/plugins/api";

export const state = () => ({
	data: [],

	adding: false,
	removing: false,
});

export const mutations = {
	async addCategory(state, category){
		this.commit('categories/setAdding', true);
		const res = await api.createCategory(category);
		this.commit('categories/setAdding', false);

		this.commit('categories/pushCategory', res.data.category);
	},
	async removeCategory(state, category){
		this.commit('categories/setRemoving', true);
		const res = await api.removeCategory(category);
		this.commit('categories/setRemoving', false);

		this.commit('categories/setCategories', res.data.categories);
	},

	pushCategory(state, category){
		state.data.push(category);
	},
	setCategories(state, categories){
		state.data = categories;
	}
};
for(const key of Object.keys(state())){
	if(key == 'data')
		continue;

	const keyName = key.charAt(0).toUpperCase() + key.slice(1);
	mutations[`set${keyName}`] = function(state, b){
		state[key] = b;
	}
}

export const actions = {
	async load(state){
		const res = await api.loadCategories();
		const categories = res.data.categories;

		state.commit('setCategories', categories);
	}
};