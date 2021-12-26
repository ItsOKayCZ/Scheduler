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
			<v-form v-model='isFormValid' ref='form' class='mt-4' lazy-validation>
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

					<v-col cols='12' class='d-flex flex-row align-center'>
						<v-switch
							v-model='repeat'
							label='Repeat'
							inset

							class='mr-5'
						></v-switch>

						<v-text-field
							ref='repeatAfter'

							type='number'
							v-model='repeatAfter'
							label='After (days)'

							:rules='[rules.isPositiveNumber]'
							:error-messages="repeatAfterErrorMessages"

							style='max-width: 150px;'
							class='mr-4'

							:disabled='!repeat'
						></v-text-field>

						<date-picker
							:date.sync='repeatTo'
							value-if-empty='Infinite'
							label='To'

							:disabled='!repeat'
							:clearable='true'
							:allowed-dates='allowedDates'
						>
							<v-spacer></v-spacer>
							<v-btn @click='setRepeatToToday'>
								Today
							</v-btn>
						</date-picker>
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
								<div style='width: 100%;' class='d-flex justify-space-between align-start'>
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

		<snackbar-event
			:statement='addingCategories'
			text='Adding category'
		></snackbar-event>
		<snackbar-event
			:statement='removingCategories'
			text='Removing category'
		></snackbar-event>
	</v-card>
</template>

<script>
import moment from 'moment';

import SnackbarEvent from '../SnackbarEvent.vue';

import DateTimePicker from '../dateTimePicker.vue';
import AddCategoryDialog from './addCategoryDialog.vue';
import DatePicker from '../datePicker';

export default{
	props: ['display'],
	components: {
		DateTimePicker,
		AddCategoryDialog,
		SnackbarEvent,
		DatePicker,
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
			repeatAfter: 1,
			repeatTo: null,

			datePickerFormat: 'DD (ddd).MM.YYYY',
			rules: {
				required: value => !!value || 'Required',
				isPositiveNumber: value => !this.repeat || (typeof(value) === 'number' && value > 0) || 'Must be positive number',
			},

			isFormValid: false,
			repeatAfterErrorMessages: [],
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
		},

		addingCategories(){
			return this.$store.state.categories.adding;
		},
		removingCategories(){
			return this.$store.state.categories.removing;
		},
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
				repeatAfter: this.repeatAfter,
				repeatTo: this.repeatTo
			});
			this.close();
		},

		removeCategory(category){
			this.$store.commit('categories/removeCategory', category);
		},

		setRepeatToToday(){
			this.repeatTo = moment();
		},
		allowedDates(date){
			return moment(date, 'YYYY-MM-DD').isSameOrAfter(moment(), 'day');
		},
	},
	watch: {
		repeat(){
			if(!this.repeat){
				this.$refs.repeatAfter.resetValidation();
				this.repeatAfterErrorMessages = [];
			} else {
				this.$refs.repeatAfter.validate()
				this.repeatAfterErrorMessages = this.$refs.repeatAfter.errorBucket;
			}
		},
		repeatAfter(value){
			if(typeof(value) !== 'number' && !isNaN(parseInt(value)))
				this.repeatAfter = parseInt(value);
		}
	}
};
</script>

<style scoped>
.capitalize{
	text-transform: capitalize;
}
</style>