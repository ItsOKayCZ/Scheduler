<template>
	<v-row>
		<v-col cols="12" class='fill-width'>
			<h2 class='white--text'>{{ label }}</h2>
			
			<div class='d-flex flex-row'>
				<v-menu
					transition="scale-transition"
					offset-y
					v-model="datePickerDisplay"

					max-width="300px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							label="Date"
							readonly
							:value="formattedDate"
							v-on="on"
							v-bind="attrs"

							class='notSelectable mr-4'
							style='max-width: 200px'
						></v-text-field>
					</template>

					<v-date-picker
						@input="datePickerDisplay = false"
						v-model="formattedDateProxy"
						:first-day-of-week="1"

						full-width
					>
					</v-date-picker>
				</v-menu>

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
							style='max-width: 50px'
						></v-text-field>
					</template>

					<v-time-picker
						v-if='timePickerDisplay'
						format="24hr"
						v-model="formattedTimeProxy"
						@click:minute="timePickerDisplay = false"
					></v-time-picker>
				</v-menu>
			</div>
		</v-col>

		<!-- <v-col>
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
		</v-col> -->
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