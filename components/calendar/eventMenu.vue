<template>
	<v-menu
		v-model="display"
		:activator="activator"
		offset-x
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
				<v-spacer></v-spacer>

				<v-btn icon @click='removeEvent'>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</v-toolbar>

			<v-card-text>
					<p><strong>Start: </strong>{{ eventStart.format('DD.MM.YYYY HH:mm') }}</p>
					<p><strong>End: </strong>{{ eventEnd.format('DD.MM.YYYY HH:mm') }}</p>
					<p><strong>Repeat: </strong>{{ eventRepeat }}</p>
					<p v-show='eventRepeat'><strong>After:</strong> {{ eventRepeatAfter }} day(s)</p>
			</v-card-text>
		</v-card>
	</v-menu>
</template>

<script>
import moment from 'moment';

export default {
	props: ['event', 'activator'],
	data(){
		return {
			display: false
		};
	},
	methods: {
		removeEvent(){
			this.$store.commit('events/removeEvent', this.event);
			this.display = false;
		},
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
		eventStart(){
			if(!this.event?.start)
				return moment();
			return moment(this.event.start);
		},
		eventEnd(){
			if(!this.event?.end)
				return moment();
			return moment(this.event.end);
		},

		eventRepeat(){
			if(!this.event?.repeat)
				return false;
			return this.event.repeat;
		},
		eventRepeatAfter(){
			if(!this.event?.repeatAfter)
				return 0
			return this.event.repeatAfter;
		}
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

