<template>
	<v-menu
		transition="scale-transition"
		offset-y
		v-model='display'

		:close-on-content-click='false'

		max-width="300px"
	>
		<template v-slot:activator='{ on, attrs }'>
			<v-text-field
				:label='label'
				v-model='formattedDate'

				:disabled='disabled'
				:clearable='clearable && date != null'

				hide-details="true"
				readonly
				dense

				v-bind='attrs'
				v-on='on'
			></v-text-field>
		</template>

		<v-date-picker
			@input='display = false'
			v-model='calendarDate'

			:allowed-dates="allowedDates"

			:first-day-of-week="1"
			
			no-title

			full-width
		>
			<slot />
		</v-date-picker>
	</v-menu>
</template>

<script>
import * as moment from 'moment';

export default {
	props: [
		'date',
		'valueIfEmpty',

		'label',
		'disabled',
		'clearable',
		'allowedDates',
	],
	data(){
		return {
			display: false,
		};
	},
	computed: {
		dateProxy: {
			set(value){
				if(!value)
					this.$emit('update:date', null);
				else
					this.$emit('update:date', value);
			},
			get(){
				if(!this.date)
					return null;
				return this.date;
			}
		},
		formattedDate: {
			get(){
				if(!this.dateProxy)
					return this.valueIfEmpty;
				return this.dateProxy.format('DD.MM.YYYY');
			},
			set(value){
				this.dateProxy = null;
			}
		},
		calendarDate: {
			set(value){
				this.dateProxy = moment(value, 'YYYY-MM-DD');
			},
			get(){
				if(!this.date)
					return null;
				return this.date.format('YYYY-MM-DD');
			}
		},
	},
};
</script>