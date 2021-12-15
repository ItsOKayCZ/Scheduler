<template>
	<v-card>
		<v-toolbar color='primary'>
			<v-btn icon @click='close'>
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<v-toolbar-title>Add event</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn text @click='add' :disabled='!isFormValid'>
					Add
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<v-card-text>
			<v-form v-model='isFormValid' class='mt-4'>
				<v-row>
					<v-col cols='12'>
						<v-text-field
							label='Name'
							v-model='name'

							:rules='[rules.required]'
						></v-text-field>
					</v-col>
					<v-col cols='12'>
						<date-time-picker
							label='Start'
							:date.sync='startDate'
							:time.sync='startTime'

							:disable-time='allDay'

							:date-format='datePickerFormat'
						></date-time-picker>
					</v-col>
					<v-col cols='12'>
						<date-time-picker
							label='End'
							:date.sync='endDate'
							:time.sync='endTime'

							:disable-time='allDay'

							:date-format='datePickerFormat'
						></date-time-picker>

						<v-switch
							v-model='allDay'
							label='All day'
							inset

							hide-details="true"
						></v-switch>
					</v-col>

					<v-col cols='12' class='d-flex flex-row'>
						<v-switch
							v-model='repeat'
							label='Repeat'
							inset

							class='mr-5'
						></v-switch>

						<v-text-field
							type='number'
							v-model='repeatAfter'
							label='After'

							:rules='[rules.positiveNumber]'

							style='max-width: 150px;'

							:disabled='!repeat'
						></v-text-field>
					</v-col>

					<v-col cols='12'>
						<v-divider class='mb-4'></v-divider>
						<v-autocomplete
						outlined

							v-model='category'
							:items='categories'
							item-text="title"
							item-value="title"

							:rules='[rules.required]'
						>
							<template v-slot:selection='data'>
								<v-chip outlined :color='data.item.color' v-ripple class='capitalize'>
									<v-icon left>mdi-circle</v-icon>
									{{ data.item.title }}
								</v-chip>
							</template>

							<template v-slot:item='data'>
								<div style='width: 100%;' class='d-flex justify-space-between align-center'>
									<v-chip outlined :color='data.item.color' class='capitalize'>
										<v-icon left>mdi-circle</v-icon>
										{{ data.item.title }}
									</v-chip>

									<v-btn @click.prevent='removeCategory(data.item)' x-small fab color='red'>
										<v-icon>mdi-minus</v-icon>
									</v-btn>
								</div>
							</template>

							<template v-slot:no-data>
								<h3 class='d-flex justify-center mt-2'>No categories available</h3>
							</template>

							<template v-slot:prepend-item>
								<add-category-dialog />
							</template>
						</v-autocomplete>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
import moment from 'moment';

import dateTimePicker from '../dateTimePicker.vue';
import AddCategoryDialog from './addCategoryDialog.vue';

export default{
	props: ['display'],
	components: {
		dateTimePicker,
		AddCategoryDialog
	},
	data(){
		return {
			name: '',
			startDate: moment(),
			startTime: moment(),
			endDate: moment().add(1, 'hour'),
			endTime: moment().add(1, 'hour'),
			category: null,
			allDay: false,

			repeat: false,
			repeatAfter: 0,

			datePickerFormat: 'DD (ddd).MM.YYYY',
			rules: {
				required: value => !!value || 'Required',
				positiveNumber: value => (!this.repeat || value > 0) || 'Number has to be bigger than 0'
			},

			isFormValid: false,
		}
	},
	computed: {
		categories(){
			return this.$store.state.categories.data;
		},

		start(){
			const dateStr = this.startDate.format('DD.MM.YYYY');
			const timeStr = this.startTime.format('HH:mm');

			return moment(`${dateStr} ${timeStr}`, 'DD.MM.YYYY HH:mm');
		},
		end(){
			const dateStr = this.endDate.format('DD.MM.YYYY');
			const timeStr = this.endTime.format('HH:mm');

			return moment(`${dateStr} ${timeStr}`, 'DD.MM.YYYY HH:mm');
		}
	},
	methods: {
		close(){
			this.$emit('update:display', false);
		},
		add(){
			this.$emit('add', {
				name: this.name,
				start: this.start.toDate(),
				end: this.end.toDate(),
				category: this.category,
				timed: !this.allDay,
				repeat: this.repeat,
				repeatAfter: this.repeatAfter
			});
			this.close();
		},

		removeCategory(category){
			this.$store.commit('categories/removeCategory', category);
		}
	},
};
</script>

<style scoped>
.capitalize{
	text-transform: capitalize;
}
</style>