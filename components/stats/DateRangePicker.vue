<template>
	<v-menu
		v-model='display'
		:close-on-content-click='false'
		offset-y

		max-width="300px"
	>
		<template v-slot:activator='{ on, attrs }'>
			<v-text-field
				dense
				outlined
				prepend-inner-icon="mdi-calendar-multiple"

				:hide-details="true"

				:value='formattedDates'

				label='Range'
				readonly

				v-on='on'
				v-bind='attrs'

				style='max-width: 225px;'
			></v-text-field>
		</template>

		<v-date-picker
			v-model='datesProxy'
			range

			full-width

			:first-day-of-week="1"
		>
			<v-spacer></v-spacer>
			<v-btn @click='display = false'>Close</v-btn>
		</v-date-picker>
	</v-menu>
</template>

<script>
import * as moment from 'moment';

export default {
	props: ['dates'],
	data(){
		return {
			display: false
		};
	},
	computed: {
		datesProxy: {
			get(){
				return this.dates.map(d => d?.format('YYYY-MM-DD'));
			},
			set(value){
				this.$emit('update:dates', value.map(v => moment(v, 'YYYY-MM-DD')));
			},
		},

		formattedDates(){
			return this.dates.map(d => d.format('DD.MM.YYYY')).join(' - ');
		}
	},
};
</script>