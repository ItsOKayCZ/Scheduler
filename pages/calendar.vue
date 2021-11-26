<template>
    <v-sheet max-height="100%" height="100%">
        <v-toolbar>

			<date-picker 
				:date.sync='calendarDate'
				:view-type='viewType'
			/>
			
			<v-dialog v-model='settingsDialog'>
				<template v-slot:activator='{ on, attrs }'>
					<v-btn icon v-bind='attrs' v-on='on'>
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>

				<settings
					:display.sync='settingsDialog'
					:view-type.sync='viewType'
				/>
			</v-dialog>

			<v-spacer></v-spacer>

			<v-dialog v-model='addEventDialog'>
				<template v-slot:activator='{ on, attrs }'>
					<v-btn class='mr-4' icon
						v-bind='attrs' v-on='on'
					>
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template>

				<add-event-card
					:display.sync='addEventDialog'

					:add-event='addEvent'
				/>
			</v-dialog>

			<v-btn icon
				@click='$refs.calendar.prev()'
			>
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-btn icon
				@click='$refs.calendar.next()'
			>
				<v-icon>mdi-chevron-right</v-icon>
			</v-btn>
        </v-toolbar>

		<div class='calendarContainer'>
			<v-calendar
				ref='calendar'
				v-model='calendarDate'
				:weekdays="[1, 2, 3, 4, 5, 6, 0]"
				:type='viewType'
				mode='column'
				
				:events='events'
			></v-calendar>
		</div>
    </v-sheet>
</template>

<script>
import moment from 'moment';

import settings from '../components/calendar/settings.vue';
import datePicker from '../components/calendar/datePicker.vue';
import addEventCard from '../components/calendar/addEventCard.vue';

export default {
	components: {
		settings,
		datePicker,
		addEventCard
	},
    data: () => ({
		settingsDialog: false,
		viewTypes: ['month', 'week', 'day'],
		viewType: 'week',
		calendarDate: moment().format('YYYY-MM-DD'),

		addEventDialog: false,
		events: [
		],

        colors: [
			"blue",
			"indigo",
			"deep-purple",
			"cyan",
			"green",
			"orange",
			"grey darken-1",
        ],
        names: [
			"Meeting",
			"Holiday",
			"PTO",
			"Travel",
			"Event",
			"Birthday",
			"Conference",
			"Party",
        ],
    }),
	methods: {
		addEvent(event){
			this.events.push(event);
			// this.events = [
			// 	{
			// 		name: 'All day event',
			// 		start: moment().toDate(),
			// 		end: moment().add(1, 'day').toDate(),
			// 		color: 'orange',
			// 		timed: false
			// 	},
			// 	{
			// 		name: 'Timed event',
			// 		start: moment().toDate(),
			// 		end: moment().add(1, 'hour').toDate(),
			// 		color: 'blue',
			// 		timed: true
			// 	},
			// ];
		}
	}
};
</script>

<style>
.calendarContainer{
	height: calc(100vh - 56px - 50px);
	max-height: calc(100vh - 56px - 50px);
	background-color: red;
}

@media screen and (max-width: 700px){
	.v-calendar-daily_head-day-label .v-btn{
		width: 40px;
		height: 40px;
	}
}
</style>