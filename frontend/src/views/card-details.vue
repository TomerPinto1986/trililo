<template>
	<section v-if="card" class="card-details">
		<button @click="emitClose">x</button>
		<h2>{{ card.title }}</h2>
		<card-activity />
	</section>
</template>

<script>
import cardActivity from '../cmps/card/card-activity.cmp';

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
		const cardId = this.$route.params.cardId
		this.$store.commit({type:'updateCurrCard', cardId})
		this.card = this.$store.getters.currCard;	
	},
	components: {
		cardActivity
	}
}
</script>

<style>
</style>