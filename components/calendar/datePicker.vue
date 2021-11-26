<template>
	<v-menu
		transition="scale-transition"
		offset-y
		v-model='display'
	>
		<template v-slot:activator='{ on, attrs }'>
			<v-text-field
				label='Date'
				:value='formattedDate'
				v-bind='attrs'
				v-on='on'
				hide-details="true"
				readonly
				prepend-icon="mdi-calendar-search"
			></v-text-field>
		</template>

		<v-date-picker
			@input='display = false'
			v-model='dateProxy'
			:show-current='currentDate'
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