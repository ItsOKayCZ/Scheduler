<template>
    <v-sheet max-height="100%" height="100%">
        <v-toolbar>
			<v-toolbar-title>Calendar</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-btn text fab small>
				<v-icon>mdi-chevron-left</v-icon>
			</v-btn>
			<v-btn text fab small>
				<v-icon>mdi-chevron-right</v-icon>
			</v-btn>
        </v-toolbar>

		<div class='calendarContainer'>
			<v-calendar
				:weekdays="[1, 2, 3, 4, 5, 6, 0]"
				type="week"
			></v-calendar>
		</div>
    </v-sheet>
</template>

<script>
export default {
    data: () => ({
        type: "month",
        types: ["month", "week", "day", "4day"],
        mode: "stack",
        modes: ["stack", "column"],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [
			{ text: "Sun - Sat", value: [0, 1, 2, 3, 4, 5, 6] },
			{ text: "Mon - Sun", value: [1, 2, 3, 4, 5, 6, 0] },
			{ text: "Mon - Fri", value: [1, 2, 3, 4, 5] },
			{ text: "Mon, Wed, Fri", value: [1, 3, 5] },
        ],
        value: "",
        events: [],
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
        getEvents({ start, end }) {
			const events = [];

			const min = new Date(`${start.date}T00:00:00`);
			const max = new Date(`${end.date}T23:59:59`);
			const days = (max.getTime() - min.getTime()) / 86400000;
			const eventCount = this.rnd(days, days + 20);

			for (let i = 0; i < eventCount; i++) {
				const allDay = this.rnd(0, 3) === 0;
				const firstTimestamp = this.rnd(min.getTime(), max.getTime());
				const first = new Date(firstTimestamp - (firstTimestamp % 900000));
				const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
				const second = new Date(first.getTime() + secondTimestamp);

				events.push({
					name: this.names[this.rnd(0, this.names.length - 1)],
					start: first,
					end: second,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
					timed: !allDay,
				});
			}

			this.events = events;
        },
        getEventColor(event) {
			return event.color;
        },
        rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a;
        },
    },
};
</script>

<style>
.calendarContainer{
	height: calc(100vh - 56px - 50px);
	max-height: calc(100vh - 56px - 50px);
	background-color: red;
}
</style>