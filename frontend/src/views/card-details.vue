<template>
	<section v-if="card" class="card-details">
		<h2>{{ card.title }}</h2>
	</section>
</template>

<script>
export default {
	data() {
		return {
            card: this.$store.getters.currCard
        }
	},
	computed: {},
	methods: {},
	created() {
		const route = this.$route.path.split('/')
        const cardId = route[route.length - 1]
        this.$store.commit({type:'updateCurrCard', cardId})
	}

}
</script>

<style>
</style>