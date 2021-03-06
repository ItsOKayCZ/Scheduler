<template>
	<v-card
		:style='{
			transition: "opacity 0.2s",
			opacity: preview ? 0.2 : 1
		}'
	>
		<v-toolbar color='primary'>
			<v-btn icon @click='close'>
				<v-icon>mdi-close</v-icon>
			</v-btn>

			<v-toolbar-title v-if='edit'>Edit event</v-toolbar-title>
			<v-toolbar-title v-else>Add event</v-toolbar-title>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn text @mousedown='togglePreview(true)' @mouseup='togglePreview(false)'>
					<v-icon>mdi-eye</v-icon>
				</v-btn>
				<v-btn v-if='edit' text @click='editEvent' :disabled='!isFormValid'>
					<v-icon>mdi-content-save-edit</v-icon>Edit
				</v-btn>
				<v-btn v-else text @click='add' :disabled='!isFormValid'>
					<v-icon>mdi-plus-thick</v-icon>Add
				</v-btn>
			</v-toolbar-items>
		</v-toolbar>

		<v-card-text>
			<v-form v-model='isFormValid' @change='didChange = true' ref='form' class='mt-4'>
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
							@blur='setRepeatAfterErrorMessages'
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

import eventsMixin from '~/plugins/mixins/Events.js';
import categoriesMixin from '~/plugins/mixins/Categories.js';

export default{
	props: [
		'display',

		'edit',
		'event',
	],
	components: {
		DateTimePicker,
		AddCategoryDialog,
		SnackbarEvent,
		DatePicker,
	},
	mixins: [
		eventsMixin,
		categoriesMixin
	],
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
			exclude: [],

			datePickerFormat: 'DD (ddd).MM.YYYY',
			rules: {
				required: value => !!value || 'Required',
				isPositiveNumber: value => !this.repeat || (typeof(value) === 'number' && value > 0) || 'Must be positive number',
			},

			isFormValid: false,
			didChange: false,
			repeatAfterErrorMessages: [],

			preview: false,
		}
	},
	created(){
		this.setEventForEdit();
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
		eventObj(){
			let exclude = [];
			if(!this.edit && !this.didChange)
				exclude = this.exclude;

			return {
				name: this.name,
				start: this.start.toDate(),
				end: this.end.toDate(),
				category: this.category,
				timed: !this.allDay,
				repeat: this.repeat,
				repeatAfter: this.repeatAfter,
				repeatTo: this.repeatTo,
				exclude
			};
		},

		addingCategories(){
			return this.$store.state.categories.adding;
		},
		removingCategories(){
			return this.$store.state.categories.removing;
		},
	},
	methods: {
		togglePreview(state=null){
			if(!state)
				this.preview = !this.preview;
			else
				this.preview = state;
		},
		close(){
			this.$emit('update:display', false);
		},
		add(){
			this.$emit('add', this.eventObj);
			this.close();
		},
		editEvent(){
			this.$emit('edit', this.eventObj);
			this.close();
		},
		setEventForEdit(){
			if(this.edit){
				this.name = this.event.name;
				this.startDate = this.startTime = moment(this.event.start);
				this.endDate = this.endTime = moment(this.event.end);
				this.category = this.event.category;
				this.allDay = !this.event.timed;

				this.repeat = this.event.repeat;
				this.repeatAfter = this.event.repeatAfter;
				this.repeatTo = this.event.repeatTo ? moment(this.event.repeatTo) : null;

				this.exclude = this.event.exclude;

				this.$nextTick(() => {
					this.$refs.form.resetValidation();
					this.repeatAfterErrorMessages = [];
				});
			}
		},

		setRepeatAfterErrorMessages(){
			this.repeatAfterErrorMessages = this.$refs.repeatAfter.errorBucket;
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
		},
		event(){
			this.setEventForEdit();
		}
	}
};
</script>

<style scoped>
.capitalize{
	text-transform: capitalize;
}
</style>