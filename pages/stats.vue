<template>
	<client-only>
		<v-sheet class="main" max-height="100%" height="100%">
			<v-toolbar height="56px">
				<date-range-picker :dates.sync="dateRange"></date-range-picker>
			</v-toolbar>

			<v-container>
				<v-skeleton-loader
					v-if='!end'
					type='card, card, card'
				></v-skeleton-loader>
				<v-card
					v-if='end'
					v-for="(panel, index) in panels"
					:key="index"
					class="card mb-4"
					color="grey darken-4"
					:height="!openedPanels.includes(index) ? 64 : ''"
				>
					<v-card-title class="card-title" @click="toggleCard(index)">
						{{ panel.title }}

						<v-spacer></v-spacer>

						<v-btn icon>
							<v-icon v-show="openedPanels.includes(index)">mdi-chevron-down</v-icon>
							<v-icon v-show="!openedPanels.includes(index)">mdi-chevron-up</v-icon>
						</v-btn>
					</v-card-title>

					<v-divider></v-divider>

					<v-card-text>
						<VueApexCharts
							:type="panel.chartOptions.type"
							:options="panel.chartOptions"
							:series="panel.series"
						></VueApexCharts>
					</v-card-text>
				</v-card>
			</v-container>
		</v-sheet>
	</client-only>
</template>

<script>
import * as moment from "moment";

import Events from '~/plugins/Mixins/Events';

import DateRangePicker from "~/components/stats/DateRangePicker.vue";

export default {
	components: {
		VueApexCharts: () => import("vue-apexcharts"),
		DateRangePicker,
	},
	mixins: [Events],
	data() {
		return {
			openedPanels: [],

			defaultChartOptions: {
				theme: {
					mode: "dark",
					palette: "palette1",
				},
				chart: {
					background: "transparent",
				},
			},

			start: moment().startOf("week"),
			end: moment().endOf("week"),
		};
	},
	created() {
		this.openedPanels = Array.from(Array(this.panels.length).keys());
	},
	computed: {
		panels() {
			return [
				{
					title: "Time spent",
					chartOptions: this.timeSpentChartOptions,
					series: this.timeSpentChartSeries,
				},
			];
		},
		timeSpentChartOptions() {
			return {
				labels: Object.keys(this.timeSpentData),
				colors: Object.keys(this.timeSpentData).map(l => {
					const category = this.categories.find(c => c.title == l);
					if(!category) return '#555';

					return category.color;
				}),

				type: "pie",


				dataLabels: {
					formatter: (val, opts) => {
						const hours = this.timeSpentChartSeries[opts.seriesIndex];
						if(!hours)
							return;

						if(hours <= 1)
							return `${hours.toFixed(2)} hour`;
						return `${hours.toFixed(2)} hours`;
					}
				},
				tooltip: {
					x: {
						show: false,
					},
					y: {
						formatter: (value) => {
							if(value <= 1)
								return `${value.toFixed(2)} hour`;
							return `${value.toFixed(2)} hours`;
						},
					},
				},

				...this.defaultChartOptions,
			};
		},
		timeSpentChartSeries() {
			return Object.values(this.timeSpentData);
		},
		timeSpentData(){
			if(!this.end)
				return {};

			let freeTime = this.end.diff(this.start, 'hours');

			const summary = {};
			for(const event of this.events){
				if(!summary[event.category])
					summary[event.category] = 0;

				const start = moment(event.start);
				const end = moment(event.end);
				const hours = parseFloat(moment.duration(end.diff(start)).asHours().toFixed(2));
				summary[event.category] += hours;
				freeTime -= hours;
			}
			
			return {
				...summary,
				'Free': freeTime
			};
		},

		events(){
			return this.getAllEventsInRange(this.start, this.end);
		},
		categories(){
			return this.$store.state.categories.data;
		},

		dateRange: {
			get() {
				const dates = [this.start];
				if (this.end) dates.push(this.end);
				return dates;
			},
			set(dates) {
				if(dates[1] && dates[1].isBefore(dates[0], 'days')){
					this.start = dates[1].startOf('day');
					this.end = dates[0]?.endOf('day');
				} else {
					this.start = dates[0].startOf('day');
					this.end = dates[1]?.endOf('day');
				}
			},
		},
	},
	methods: {
		toggleCard(index) {
			if (this.openedPanels.includes(index))
				this.openedPanels = this.openedPanels.filter((p) => p != index);
			else this.openedPanels.push(index);
		},
	},
};
</script>

<style lang="scss">
.card {
	overflow-y: hidden;

	.v-card__text{
		overflow-x: hidden;
	}

	.card-title {
		cursor: pointer;
		user-select: none;
	}
}
</style>