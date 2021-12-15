<template>
	<v-menu
		transition="scale-transition"
		offset-y
		v-model='display'

		max-width="300px"
	>
		<template v-slot:activator='{ on, attrs }'>
			<v-text-field
				label='Selected date'
				:value='formattedDate'
				v-bind='attrs'
				v-on='on'
				hide-details="true"
				readonly
				prepend-inner-icon="mdi-calendar-search"

				style='max-width: 130px'

				outlined
				dense
			></v-text-field>
		</template>

		<v-date-picker
			@input='display = false'
			v-model='dateProxy'
			:show-current='currentDate'
			:first-day-of-week="1"

			full-width
		>
			<v-spacer></v-spacer>
			<v-btn outlined
				@click='selectToday'
			>Today</v-btn>
		</v-date-picker>
	</v-menu>
</template>

<script>
import moment from 'moment';

export default{
	props: ['date', 'viewType'],
	data(){
		return {
			display: false,

			mainFormat: 'YYYY-MM-DD',
			displayFormat: 'DD.MM.YYYY',
		};
	},
	computed: {
		dateProxy: {
			set(value){
				this.$emit('update:date', value);
			},
			get(){
				return this.date;
			}
		},

		currentDate(){
			return moment().format(this.mainFormat);
		},

		formattedDate(){
			return moment(this.dateProxy, this.mainFormat).format(this.displayFormat);
		}
	},
	methods: {
		selectToday(){
			this.dateProxy = moment().format(this.mainFormat);
		}
	},
}
</script>

<style>
.v-date-picker-table__current{
	background-color: #7d7d7d;
}
</style>