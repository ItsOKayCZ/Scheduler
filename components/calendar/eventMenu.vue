<template>
	<v-menu
		v-model="display"
		:activator="activator"
		offset-x
		:close-on-content-click="false"
		max-width="400px"
		min-width="250px"
	>
		<v-card flat>
			<v-toolbar
				:light='isContrastingColor(eventColor)'
				:color="eventColor"
			>
				<v-tooltip top>
					<template v-slot:activator='{ on, attrs }'>
						<v-toolbar-title
							v-on='on'
							v-bind='attrs'
						>
							{{ eventName }}
						</v-toolbar-title>
					</template>
					<span>{{ eventName }}</span>
				</v-tooltip>
				<v-spacer></v-spacer>

				<v-dialog
					v-model='editEventDialog'
					fullscreen
					transition="dialog-bottom-transition"
				>
					<template v-slot:activator='{ on, attrs }'>
						<v-btn icon
							v-bind='attrs'
							v-on='on'
						>
							<v-icon>mdi-pencil</v-icon>
						</v-btn>
					</template>

					<configure-event-card
						:display.sync='editEventDialog'
						:edit='true'
						:event='event'
						@edit='edit'
					/>
				</v-dialog>
			</v-toolbar>

			<v-card-text>
				<div>
					<h3 class='white--text'>Duration</h3>
					<p>{{ eventStart.format('DD.MM.YYYY HH:mm') }} - {{ eventEnd.format('DD.MM.YYYY HH:mm') }}</p>
				</div>
				<div v-if='eventRepeat'>
					<h3 class='white--text'>Repeat</h3>
					<p>Every {{ eventRepeatAfter }} day(s) to {{ eventRepeatTo }}</p>

					<template v-if='eventExclude != null'>
						<h3 class='white--text'>Excluded for</h3>
						<ul v-for='(date, index) of eventExclude' :key='index'>
							<li>{{ date }}</li>
						</ul>
					</template>
				</div>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn v-if='!eventRepeat' @click='confirmToDeleteEvent' :color='needConfirmDelete ? "primary" : "red"'>
					<v-icon>mdi-delete</v-icon>Delete
				</v-btn>
				
				<div v-else class='d-flex flex-column'>
					<h4>Delete</h4>
					<v-btn-toggle dense>
						<v-btn @click='confirmToDeleteEventOnce' :color='needConfirmDeleteOnce ? "primary" : "red"'>
							<v-icon>mdi-repeat-once</v-icon>Current
						</v-btn>
						<v-btn @click='confirmToDeleteEvent' :color='needConfirmDelete ? "primary" : "red"'>
							<v-icon>mdi-calendar-refresh</v-icon>Repeating
						</v-btn>
					</v-btn-toggle>
				</div>
			</v-card-actions>
		</v-card>
	</v-menu>
</template>

<script>
import moment from "moment";
import configureEventCard from "./configureEventCard.vue";

import eventsMixin from '~/plugins/mixins/Events';
import colorMixin from '~/plugins/mixins/Color';

export default {
	components: { configureEventCard },
	props: ["event", "activator"],
	mixins: [ colorMixin, eventsMixin ],
	data() {
		return {
			display: false,
			editEventDialog: false,

			needConfirmDelete: true,
			needConfirmDeleteOnce: true,
		};
	},
	methods: {
		edit(event){
			this.editEvent({
				...event,
				_id: this.event._id
			});
			this.display = false;
		},
		confirmToDeleteEvent() {
			if(this.needConfirmDelete){
				this.needConfirmDeleteOnce = true;
				this.needConfirmDelete = false;
				return;
			}
			this.removeEvent(this.event);
			this.display = false;
		},
		confirmToDeleteEventOnce(){
			if(this.needConfirmDeleteOnce){
				this.needConfirmDeleteOnce = false;
				this.needConfirmDelete = true;
				return;
			}

			this.removeCurrentEvent(this.event);
			this.display = false;
		}
	},
	computed: {
		eventName() {
			if (!this.event?.name) return "";
			return this.event.name;
		},
		eventColor() {
			if (!this.event?.color) return "";
			return this.event.color;
		},
		eventStart() {
			if (!this.event?.start) return moment();
			return moment(this.event.start);
		},
		eventEnd() {
			if (!this.event?.end) return moment();
			return moment(this.event.end);
		},

		eventRepeat() {
			if (!this.event?.repeat) return false;
			return this.event.repeat;
		},
		eventRepeatAfter() {
			if (!this.event?.repeatAfter) return 0;
			return this.event.repeatAfter;
		},
		eventRepeatTo(){
			if(!this.event?.repeatTo) return 'Infinite';
			return moment(this.event.repeatTo).format('DD.MM.YYYY');
		},
		eventExclude(){
			if(!this.event?.exclude) return null;
			if(this.event.exclude.length == 0) return null;
			return this.event.exclude.map(d => moment(d).format('DD.MM.YYYY'));
		}
	},
	watch: {
		event(value, prevVal) {
			if (
				prevVal == null ||
				JSON.stringify(value) != JSON.stringify(prevVal)
			) {
				requestAnimationFrame(() =>
					requestAnimationFrame(() => {
						this.display = true;
					})
				);
			} else this.display = false;
		},
		display(){
			if(!this.display){
				this.needConfirmDelete = true;
				this.needConfirmDeleteOnce = true;
			}
		}
	},
};
</script>

