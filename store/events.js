import api from '~/services/api';

export const state = () => ({
	data: []
});

export const mutations = {
	async addEvent(state, event){
		const res = await api.createEvent(event);

		this.commit('events/pushEvent', res.data.event);
	},

	pushEvent(state, event){
		state.data.push(event);
	},
	setEvents(state, events){
		state.data = events;
	}
};

export const actions = {
	async load(state){
		const res = await api.getEvents();
		const events = res.data.events;

		state.commit('setEvents', events);
	}
};