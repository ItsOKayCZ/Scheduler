<template>
	<v-card>
		<v-card-title>Add event</v-card-title>

		<v-card-text>
			<v-row>
				<v-text-field
					label='Name'
					v-model='name'
					hide-details="true"
				></v-text-field>
			</v-row>

			<date-time-picker
				label='Start'
				:date.sync='startDate'
				:time.sync='startTime'
			></date-time-picker>
			<date-time-picker
				label='End'
				:date.sync='endDate'
				:time.sync='endTime'
			></date-time-picker>
		</v-card-text>

		<v-card-actions>
			<v-spacer></v-spacer>

			<v-btn text
				@click='close'
			>
				Close
			</v-btn>
			<v-btn color='primary'
				@click='add'
			>
				Add
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import moment from 'moment';

import dateTimePicker from '../dateTimePicker.vue';

export default{
	props: ['display', 'addEvent'],
	components: {
		dateTimePicker
	},
	data(){
		return {
			name: '',
			startDate: moment(),
			startTime: moment(),
			endDate: moment().add(1, 'hour'),
			endTime: moment().add(1, 'hour'),
			color: 'orange',
			allDay: false
		}
	},
	methods: {
		close(){
			this.$emit('update:display', false);
		},
		add(){
			this.addEvent('something');
		},
	}
};
</script>