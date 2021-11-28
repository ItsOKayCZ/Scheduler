<template>
	<v-row>
		<v-col cols="2" class="d-flex justify-center align-center">
			<h2>{{ label }}</h2>
		</v-col>

		<v-col cols="6">
			<v-menu
				transition="scale-transition"
				offset-y
				v-model="datePickerDisplay"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						label="Date"
						readonly
						:value="formattedDate"
						v-on="on"
						v-bind="attrs"

						class='notSelectable'
					></v-text-field>
				</template>

				<v-date-picker
					@input="datePickerDisplay = false"
					v-model="formattedDateProxy"
				>
				</v-date-picker>
			</v-menu>
		</v-col>

		<v-col>
			<v-menu
				v-model="timePickerDisplay"

				transition="scale-transition"
				offset-y
				:close-on-content-click="false"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						label="Time"
						readonly
						:value="formattedTimeProxy"
						v-on="on"
						v-bind="attrs"

						:disabled='disableTime'

						class='notSelectable'
					></v-text-field>
				</template>

				<v-time-picker
					v-if='timePickerDisplay'
					format="24hr"
					v-model="formattedTimeProxy"
					@click:minute="timePickerDisplay = false"
				></v-time-picker>
			</v-menu>
		</v-col>
	</v-row>
</template>

<script>
import moment from "moment";

export default {
	props: ["date", "time", "label", "dateFormat", 'disableTime'],
	data() {
		return {
			datePickerDisplay: false,
			timePickerDisplay: false,

			datePickerFormat: "YYYY-MM-DD",
			displayTimeFormat: "HH:mm",

			timeTest: null,
		};
	},
	computed: {
		dateProxy: {
			set(value) {
				this.$emit("update:date", value);
			},
			get() {
				return this.date;
			},
		},
		formattedDateProxy: {
			set(value) {
				this.$emit("update:date", moment(value, this.datePickerFormat));
			},
			get() {
				return this.date.format(this.datePickerFormat);
			},
		},
		timeProxy: {
			set(value) {
				this.$emit("update:time", value);
			},
			get() {
				return this.time;
			},
		},
		formattedTimeProxy: {
			set(value) {
				this.$emit("update:time", moment(value, this.displayTimeFormat));
			},
			get() {
				return this.time.format(this.displayTimeFormat);
			},
		},

		formattedDate() {
			return this.dateProxy.format(this.dateFormat);
		},
		formattedTime() {
			return this.timeProxy.format(this.displayTimeFormat);
		},
	},
};
</script>