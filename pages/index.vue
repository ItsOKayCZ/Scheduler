<template>
	<v-container>
		<v-row>
			<v-col v-for='(item, index) in navigation' :key='index'>
				<v-card :to='item.to'>
					<v-card-actions>
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title>
									{{ item.title }}
								</v-list-item-title>
							</v-list-item-content>
							
							<v-list-item-avatar
								size='80'
								color='gray'
							>
								<v-icon>{{ item.icon }}</v-icon>
							</v-list-item-avatar>
						</v-list-item>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	props: ['navigation']
}
</script>