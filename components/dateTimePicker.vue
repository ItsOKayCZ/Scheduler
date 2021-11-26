<template>
	<v-row>
		<v-col cols='2'>
			<v-subheader>
				{{ label }}
			</v-subheader>
		</v-col>

		<v-col class='d-flex flex-row'>
			<v-text-field
			class='mr-4'
				label='Date'
				hide-details="true"
			></v-text-field>

			<v-text-field
				label='Time'
				hide-details="true"
			></v-text-field>
		</v-col>
	</v-row>
</template>

<script>
export default {
	props: ['date', 'time', 'label'],
	computed: {
		date: {
			set(value){
				this.$emit('update:date', value);
			},
			get(){
				return this.date;
			}
		},
		time: {
			get(value){
				this.$emit('update:time', value);
			},
			set(){
				return this.time;
			}
		}
	}
};
</script>