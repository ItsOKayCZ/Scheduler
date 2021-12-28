<template>
	<v-sheet max-height="100%" height="100%">
		<v-toolbar height="56px">
			<calendar-date-picker :date.sync="calendarDate" />

			<v-dialog v-model="settingsDialog">
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-cog</v-icon>
					</v-btn>
				</template>

				<settings
					:display.sync="settingsDialog"
					:view-type.sync="viewType"
				/>
			</v-dialog>

			<v-spacer></v-spacer>

			<v-dialog
				v-model="addEventDialog"
				fullscreen
				transition="dialog-bottom-transition"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-btn class="mr-4" icon v-bind="attrs" v-on="on">
						<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template>

				<configure-event-card
					:display.sync="addEventDialog"
					@add='addEvent'
				/>
			</v-dialog>

			<v-btn icon @click="$refs.calendar.prev()">
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-btn icon @click="$refs.calendar.next()">
				<v-icon>mdi-chevron-right</v-icon>
			</v-btn>
		</v-toolbar>

		<div class="calendarContainer">
			<v-calendar
				ref="calendar"
				v-model="calendarDate"
				:weekdays="[1, 2, 3, 4, 5, 6, 0]"
				:type="viewType"
				mode="column"
				:events='events'
				@click:event="selectEvent"
			>
				<template v-slot:event="data">
					<v-sheet
						class="pl-1 eventCard"
						:class="{
							blackText: isContrastingColor(data.event.color)
						}"
						:color="data.event.color"
						event.width="100%"
						height="100%"
					>
						<h3>{{ data.event.name }}</h3>
						{{ data.eventParsed.start.time }} -
						{{ data.eventParsed.end.time }}
					</v-sheet>
				</template>
			</v-calendar>

			<event-menu
				:event.sync="selectedEvent"
				:activator="selectedEventDOM"
			/>
		</div>

		<snackbar-event
			:statement='addingEvents'
			text='Adding event'
		></snackbar-event>
		<snackbar-event
			:statement='editingEvents'
			text='Editing event'
		></snackbar-event>
		<snackbar-event
			:statement='removingEvents'
			text='Deleting event'
		></snackbar-event>
	</v-sheet>
</template>

<script>
import moment from "moment";

import settings from "../components/calendar/settings.vue";
import datePicker from "../components/calendar/calendarDatePicker.vue";
import configureEventCard from "../components/calendar/configureEventCard.vue";
import eventMenu from "../components/calendar/eventMenu.vue";
import snackbarEvent from '../components/SnackbarEvent.vue';

import eventMixin from '~/plugins/mixins/Events.js';
import colorMixin from '~/plugins/mixins/Color.js';

export default {
	components: {
		settings,
		datePicker,
		configureEventCard,
		eventMenu,
		snackbarEvent,
	},
	mixins: [
		eventMixin,
		colorMixin
	],
	data: () => ({
		settingsDialog: false,
		viewTypes: ["month", "week", "day"],
		viewType: "week",
		calendarDate: moment().format("YYYY-MM-DD"),

		addEventDialog: false,

		selectedEvent: null,
		selectedEventDOM: null,
	}),
	computed: {
		calendarDateMoment(){
			return moment(this.calendarDate, 'YYYY-MM-DD');
		},
		categories() {
			return this.$store.state.categories.data;
		},
		events() {
			const start = this.calendarDateMoment.clone().startOf(this.viewType);
			const end = this.calendarDateMoment.clone().endOf(this.viewType);

			const events = this.getAllEventsInRange(start, end)
			.map((e) => {
				let color = '#555';
				const category = this.categories.find(c => c.title == e.category);
				if(category)
					color = category.color;

				return {
					...e,
					start: new Date(e.start),
					end: new Date(e.end),
					color
				};
			});

			return events;
		},
		addingEvents(){
			return this.$store.state.events.adding;
		},
		editingEvents(){
			return this.$store.state.events.editing;
		},
		removingEvents(){
			return this.$store.state.events.removing;
		},
	},
	methods: {
		selectEvent({ nativeEvent, event }) {
			this.selectedEvent = event;
			this.selectedEventDOM = nativeEvent.target;

			nativeEvent.stopPropagation();
		},
	},
};
</script>

<style>
.calendarContainer {
	height: calc(100vh - 56px - 50px);
	max-height: calc(100vh - 56px - 50px);
}
.eventCard {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	border-radius: 5px;
}
.blackText {
	color: black !important;
}

@media screen and (max-width: 700px) {
	.v-calendar-daily_head-day-label .v-btn {
		width: 40px;
		height: 40px;
	}
}
</style>