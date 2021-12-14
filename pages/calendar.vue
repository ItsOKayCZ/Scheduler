<template>
	<v-sheet max-height="100%" height="100%">
		<v-toolbar height="56px">
			<date-picker :date.sync="calendarDate" :view-type="viewType" />

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
					:add-event="addEvent"
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
							blackText: contrastingColor(data.event.color)
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
	</v-sheet>
</template>

<script>
import moment from "moment";

import settings from "../components/calendar/settings.vue";
import datePicker from "../components/calendar/datePicker.vue";
import addEventCard from "../components/calendar/addEventCard.vue";
import eventMenu from "../components/calendar/eventMenu.vue";

export default {
	components: {
		settings,
		datePicker,
		addEventCard,
		eventMenu,
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
		repeatingEvents() {
			const events = [];
			for (const e of this.events) {
				if (!e.repeat) continue;

				const start = moment(e.start);
				const end = moment(e.end);

				const selectedDate = moment(this.calendarDate, "YYYY-MM-DD");

				switch (this.viewType) {
					case "week":
						const endWeek = selectedDate.clone().endOf("week");
						for (
							let day = selectedDate.clone().startOf("week");
							day.isSameOrBefore(endWeek);
							day.add(1, "day")
						) {
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

		contrastingColor(color){
			return this.luma(color) >= 165;
		},
		luma(color){
			let rgb = this.RGBAStringToArray(color);
			console.log(rgb);
			return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
		},
		RGBAStringToArray(color){
			return color = color.slice(
				color.indexOf('(') + 1,
				color.indexOf(')')
			).split(', ');
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