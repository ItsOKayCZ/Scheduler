<template>
	<v-app>
		<v-main>
			<nuxt-child :navigation='navigation' />
		</v-main>


		<v-bottom-navigation app :height='bottomNavigationHeight' grow fixed>
			<v-btn v-for='(item, index) in navigation' :key='index' :to='item.to'>
				<span>{{ item.title }}</span>
				<v-icon>{{ item.icon }}</v-icon>
			</v-btn>
		</v-bottom-navigation>
	</v-app>
</template>

<script>
import Vue from 'vue';

import moment from 'moment';
moment.updateLocale('en', {
	week: {
		dow: 1
	}
});

export default{
	data(){
		return {
			navigation: [
				{
					title: 'Home',
					icon: 'mdi-home',
					to: '/'
				},
				{
					title: 'Calendar',
					icon: 'mdi-calendar',
					to: '/calendar'
				},
				{
					title: 'Stats',
					icon: 'mdi-chart-box-outline',
					to: '/stats'
				}
			],
			bottomNavigationHeight: 50
		};
	},
	created(){
		this.$store.dispatch('events/load');
		this.$store.dispatch('categories/load');
	},
}
</script>

<style>
html, body, #__nuxt, #__layout{
	width: 100%;
	height: 100%;
}

html{
	overflow: hidden;
	overflow-y: auto;
}

.v-item-group.v-bottom-navigation .v-btn{
	max-width: initial;
	max-height: initial;
	height: 100%;
}
</style>