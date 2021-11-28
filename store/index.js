export const state = () => ({
	categories: []
});

export const mutations = {
	addCategory(state, category){
		state.categories.push(category);
	},
	removeCategory(state, categoryTitle){
		state.categories = state.categories.filter(c => c.title != categoryTitle);
	}
}