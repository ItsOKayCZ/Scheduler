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
				<p>
					<strong>Start: </strong
					>{{ eventStart.format("DD.MM.YYYY HH:mm") }}
				</p>
				<p>
					<strong>End: </strong
					>{{ eventEnd.format("DD.MM.YYYY HH:mm") }}
				</p>

				<p><strong>Repeat: </strong>{{ eventRepeat }}</p>
				<template v-if='eventRepeat'>
					<p>
						<strong>After:</strong> {{ eventRepeatAfter }} day(s)
					</p>

					<p>
						<strong>To:</strong> {{ eventRepeatTo }}
					</p>
				</template>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn :color='needConfirmDelete ? "primary" : "red"' @click='confirmToDeleteEvent'>
					<v-icon>mdi-delete</v-icon>Delete
				</v-btn>
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
				this.needConfirmDelete = false;
				return;
			}
			this.removeEvent(this.event);
			this.display = false;
		},
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
			}
		}
	},
};
</script>

