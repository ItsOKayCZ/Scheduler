import api from '~/plugins/api';

export const state = () => ({
		data: [],

		adding: false,
		removing: false
});


export const mutations = {
	async addEvent(state, event){
		this.commit('events/setAdding', true);
		const res = await api.createEvent(event);
		this.commit('events/setAdding', false);

		this.commit('events/pushEvent', res.data.event);
	},
	async removeEvent(state, event){
		this.commit('events/setRemoving', true);
		const res = await api.removeEvent(event);
		this.commit('events/setRemoving', false);

		this.commit('events/setEvents', res.data.events);
	},

	pushEvent(state, event){
		state.data.push(event);
	},
	setEvents(state, events){
		state.data = events;
	},
};
for(const key of Object.keys(state())){
	if(key == 'data')
		continue;

	const keyName = key.charAt(0).toUpperCase() + key.slice(1);
	mutations[`set${keyName}`] = function(state, b){
		state[key] = b;
	}
}

export const actions = {
	async load(state){
		const res = await api.getEvents();
		const events = res.data.events;

		state.commit('setEvents', events);
	}
};