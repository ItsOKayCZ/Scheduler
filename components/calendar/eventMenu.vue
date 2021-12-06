<template>
	<v-menu
		v-model="display"
		:activator="activator"
		offset-y
		:close-on-content-click='false'

		max-width="200px"
	>
		<v-card
			flat
		>
			<v-toolbar
				:color='eventColor'
			>
				<v-toolbar-title>{{ eventName }}</v-toolbar-title>
			</v-toolbar>

			<v-card-text>
				{{ event }}
			</v-card-text>
		</v-card>
	</v-menu>
</template>

<script>
export default {
	props: ['event', 'activator'],
	data(){
		return {
			display: false
		};
	},
	computed: {
		eventName(){
			if(!this.event?.name)
				return '';
			return this.event.name;
		},
		eventColor(){
			if(!this.event?.color)
				return '';
			return this.event.color;
		},
	},
	watch: {
		event(value, prevVal){
			if(prevVal == null || JSON.stringify(value) != JSON.stringify(prevVal)){
				requestAnimationFrame(() => requestAnimationFrame(() => {
					this.display = true;
				}));
			} else
				this.display = false;
		}
	}
};
</script>

