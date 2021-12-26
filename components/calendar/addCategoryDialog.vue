<template>
	<v-dialog
		v-model='display'
	>
		<template v-slot:activator='{ on, attrs }'>
			<div class='d-flex'>
				<v-btn class='flex-grow-1'
					v-on='on'
					v-bind='attrs'
				>Create new category</v-btn>
			</div>
		</template>

		<v-card>
			<v-card-title>
				New category
			</v-card-title>

			<v-card-text>
				<v-form v-model='isFormValid'>
					<v-text-field
						label='Name'
						v-model='name'

						:rules='[rules.required]'
					></v-text-field>

					<v-color-picker light
						v-if='display'

						hide-mode-switch
						mode='rgba'
						v-model='color'
					></v-color-picker>
				</v-form>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn text @click='display = false'>Close</v-btn>
				<v-btn @click='save' color='primary' :disabled='!isFormValid'>Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import categoriesMixin from '~/plugins/mixins/Categories.js';

export default {
	mixins: [
		categoriesMixin
	],
	data(){
		return {
			display: false,

			isFormValid: false,

			name: null,
			color: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			},

			rules: {
				required: value => !!value || 'Required'
			}
		}
	},
	methods: {
		generateColor(){
			for(const channel in this.color)
				if(channel != 'a')
					this.color[channel] = Math.floor(Math.random() * 255);
		},

		save(){
			this.addCategory({
				title: this.name,
				color: `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
			});

			this.display = false;
		},
	},
	watch: {
		display(){
			if(this.display){
				this.generateColor();
			}
		}
	}
};
</script>