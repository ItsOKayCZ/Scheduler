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

				<add-event-card
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
				:events="[...events, ...repeatingEvents]"
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
			:statement='removingEvents'
			text='Removing event'
		></snackbar-event>
	</v-sheet>
</template>

<script>
import moment from "moment";

import settings from "../components/calendar/settings.vue";
import datePicker from "../components/calendar/calendarDatePicker.vue";
import addEventCard from "../components/calendar/addEventCard.vue";
import eventMenu from "../components/calendar/eventMenu.vue";
import snackbarEvent from '../components/SnackbarEvent.vue';

export default {
	components: {
		settings,
		datePicker,
		addEventCard,
		eventMenu,
		snackbarEvent,
	},
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
		categories() {
			return this.$store.state.categories.data;
		},
		events() {
			const events = this.$store.state.events.data
				.map((e) => {
					if (!e.start || !e.end) return null;

					const category = this.categories.find(
						(c) => c.title == e.category
					);
					if (!category) return null;

					return {
						...e,
						start: new Date(e.start),
						end: new Date(e.end),
						color: category.color,
					};
				})
				.filter((e) => e != null);

			return events;
		},
		addingEvents(){
			return this.$store.state.events.adding;
		},
		removingEvents(){
			return this.$store.state.events.removing;
		},
		repeatingEvents() {
			const events = [];
			for (const e of this.events) {
				if (!e.repeat) continue;

				const start = moment(e.start);
				const end = moment(e.end);

				const selectedDate = moment(this.calendarDate, "YYYY-MM-DD");

				switch (this.viewType) {
					case 'day':
						if(e.repeatTo){
							const repeatTo = moment(e.repeatTo);
							if(selectedDate.isAfter(repeatTo, 'day'))
								continue;
						}

						const dayDiff = Math.ceil(moment.duration(selectedDate.diff(start)).asDays());
						if(dayDiff == 0) continue;

						if(dayDiff % e.repeatAfter == 0){
							const duration = end.diff(start, 'minute');
							const modifiedStart = selectedDate.clone().set({
								hours: start.hours(),
								minutes: start.minutes()
							});

							events.push({
								...e,
								start: modifiedStart.toDate(),
								end: modifiedStart.add(duration, 'minute').toDate()
							});
						}
					break;

					case "week":
						const endWeek = selectedDate.clone().endOf("week");
						for (
							let day = selectedDate.clone().startOf("week");
							day.isSameOrBefore(endWeek);
							day.add(1, "day")
						) {
							if(e.repeatTo){
								const repeatTo = moment(e.repeatTo);
								if(day.isAfter(repeatTo, 'day'))
									break;
							}
							const dayDiff = Math.ceil(
								moment.duration(day.diff(start)).asDays()
							);
							if (dayDiff == 0) continue;

							if (dayDiff % e.repeatAfter == 0) {
								const duration = end.diff(start, "minute");

								const modifiedStart = day.clone().set({
									hours: start.hours(),
									minutes: start.minutes(),
								});

								events.push({
									...e,
									start: modifiedStart.toDate(),
									end: modifiedStart
										.add(duration, "minute")
										.toDate(),
								});
							}
						}
					break;

					case 'month':
						const endYear = selectedDate.clone().endOf('year');
						for (
							let day = selectedDate.clone().startOf('year');
							day.isSameOrBefore(endYear);
							day.add(1, "day")
						) {
							if(e.repeatTo){
								const repeatTo = moment(e.repeatTo);
								if(day.isAfter(repeatTo, 'day'))
									break;
							}

							const dayDiff = Math.ceil(
								moment.duration(day.diff(start)).asDays()
							);
							if (dayDiff == 0) continue;

							if (dayDiff % e.repeatAfter == 0) {
								const duration = end.diff(start, "minute");

								const modifiedStart = day.clone().set({
									hours: start.hours(),
									minutes: start.minutes(),
								});

								events.push({
									...e,
									start: modifiedStart.toDate(),
									end: modifiedStart
										.add(duration, "minute")
										.toDate(),
								});
							}
						}
					break;
				}
			}

			return events;
		},
	},
	methods: {
		async addEvent(event) {
			this.$store.commit("events/addEvent", event);
		},

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