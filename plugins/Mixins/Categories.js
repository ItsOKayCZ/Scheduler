export default {
	methods: {
		addCategory(category){
			this.$store.commit('categories/addCategory', category);
		},
		removeCategory(category){
			this.$store.commit('categories/removeCategory', category);
		}
	}
};