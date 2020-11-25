<template>
	<section v-if="card" class="card-details">
		<button @click="emitClose">x</button>
		<h2>{{ card.title }}</h2>
	</section>
</template>

<script>
export default {
	data() {
		return {
            card: null
        }
	},
	computed: {},
	methods: {
		emitClose(){
			this.$emit('close')
			this.card = null;
		}
	},
	created() {
		const route = this.$route.path.split('/')
		const cardId = route[route.length - 1]
		this.$store.commit({type:'updateCurrCard', cardId})
		this.card = this.$store.getters.currCard;
		
	}

}
</script>

<style>
</style>