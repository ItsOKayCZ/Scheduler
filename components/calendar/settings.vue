<template>
	<v-card>
		<v-card-title>Settings</v-card-title>

		<v-card-text>
			<v-row>
				<v-col>
					<v-select
						:items='viewTypes'
						v-model='viewTypeProxy'
						label='View type'
						outlined
					></v-select>
				</v-col>
			</v-row>
		</v-card-text>

		<v-divider></v-divider>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn text @click='close'>Close</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
export default{
	props: ['display', 'viewType'],
	data(){
		return {
			viewTypes: ['month', 'week', 'day'],
		};
	},
	computed: {
		viewTypeProxy: {
			set(value){
				this.$emit('update:viewType', value);
			},
			get(){
				return this.viewType;
			}
		}
	},
	methods: {
		close(){
			this.$emit('update:display', false);
		}
	}
};
</script>
