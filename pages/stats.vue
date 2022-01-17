<template>
	<client-only>
		<v-sheet class="main" max-height="100%" height="100%">
			<v-toolbar height="56px">
				<date-range-picker :dates.sync="dateRange"></date-range-picker>
			</v-toolbar>


			<v-container v-resize='onResize'>
				<v-skeleton-loader
					v-if='!end'
					type='card, card, card'
				></v-skeleton-loader>
				<v-row v-else>
					<v-col
						v-for='(panel, panelIndex) in panels'
						:key='panelIndex'
						:cols='cols'
					>
						<v-card
							class='card mb-4'
							color='grey darken-4'
							:height='!openedPanels.includes(panelIndex) ? 64: ""'
						>
							<v-card-title class='card-title' @click='toggleCard(panelIndex)'>
								{{ panel.title }}

								<v-spacer></v-spacer>

								<v-btn icon>
									<v-icon v-show="openedPanels.includes(panelIndex)">mdi-chevron-down</v-icon>
									<v-icon v-show="!openedPanels.includes(panelIndex)">mdi-chevron-up</v-icon>
								</v-btn>
							</v-card-title>

							<v-divider></v-divider>

							<v-card-text class='d-flex'>
								<VueApexCharts
									ref='chart'

									:type="panelsWithHiddenSeries[panelIndex].chartOptions.type"
									:options="panelsWithHiddenSeries[panelIndex].chartOptions"
									:series="panelsWithHiddenSeries[panelIndex].series"
								></VueApexCharts>

								<div v-if='panel.customLegend'>
									<div
										v-for='(label, index) in panel.chartOptions.labels'
										:key='index'

										class='chartLegend'
										:class='{
											hidden: isSeriesHidden(label, panelIndex)
										}'

										@click='toggleSeries(label, panelIndex)'
									>
										<div class='legendIcon'
											:style='{ "background-color": panel.chartOptions.colors[index] }'
										></div>
										<span>{{ label }}</span>
									</div>
								</div>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>

			</v-container>
		</v-sheet>
	</client-only>
</template>

<script>
import * as moment from "moment";
import clone from 'just-clone';

import Events from '~/plugins/mixins/Events';

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
			hiddenSeries: [],

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

			cols: 6,
			widthBreakpoint: 700,
		};
	},
	created() {
		this.openedPanels = Array.from(Array(this.panels.length).keys());
		this.setColSize();
	},
	computed: {
		panels() {
			return [
				{
					title: "Time spent",
					chartOptions: this.timeSpentChartOptions,
					series: this.timeSpentChartSeries,
					customLegend: true,
				},
			];
		},
		panelsWithHiddenSeries(){
			const panels = clone(this.panels);

			for(const panelIndex in panels){
				const panel = panels[panelIndex];

				const labels = [];
				const colors = [];
				const series = [];
				for(let i in panel.chartOptions.labels){
					const label = panel.chartOptions.labels[i];
					if(this.hiddenSeries?.[panelIndex]?.[label])
						continue;

					labels.push(panel.chartOptions.labels[i]);
					colors.push(panel.chartOptions.colors[i]);
					series.push(panel.series[i]);
				}

				panels[panelIndex].chartOptions.labels = labels;
				panels[panelIndex].chartOptions.colors = colors;
				panels[panelIndex].series = series;
			}

			return panels;
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

				legend: {
					show: false,
				},

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
		toggleSeries(label, index){
			if(!this.hiddenSeries[index])
				this.$set(this.hiddenSeries, index, {});
			
			this.$set(this.hiddenSeries[index], label, !this.hiddenSeries[index][label]);
		},
		isSeriesHidden(label, index){
			return this.hiddenSeries?.[index]?.[label];
		},

		setColSize(){
			if(process.browser){
				this.cols = window.innerWidth > this.widthBreakpoint ? 6 : 12;
			}
		},
		onResize(){
			this.setColSize();
		}
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

.chartLegend{
	color: white;

	display: flex;
	align-items: center;
	margin-bottom: 4px;

	user-select: none;

	.legendIcon{
		margin-right: 4px;

		border-radius: 50%;
		
		width: 12px;
		height: 12px;
	}

	&.hidden{
		opacity: 0.7;
	}

	transition: opacity 0.1s;
	&:hover{
		cursor: pointer;
		opacity: 0.7;
	}
}
</style>