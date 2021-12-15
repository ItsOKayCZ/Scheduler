<template>
	<v-snackbar
		v-model='display'
		timeout='-1'

		width='300px'
	>
		<v-row>
			<v-col class='d-flex flex-row'>
				{{ text }}

				<v-spacer></v-spacer>

				<v-progress-circular
					v-show='statement'

					indeterminate
					color='primary'
				></v-progress-circular>
				
				<v-icon v-show='!statement' color='success'>
					mdi-checkbox-marked-circle-outline
				</v-icon>
			</v-col>
		</v-row>
	</v-snackbar>
</template>

<script>
export default {
	props: ['statement', 'text'],
	data(){
		return {
			display: false,

			delay: 3000,
		};
	},
	watch: {
		statement(){
			if(this.statement)
				this.display = true;
			else {
				setTimeout(() => {
					this.display = false;
				}, this.delay);
			}
		}
	},
};
</script>