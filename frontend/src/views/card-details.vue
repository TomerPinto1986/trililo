<template>
<<<<<<< HEAD
	<section v-if="card" class="card-details">
		<button @click="emitClose">x</button>
		<h2>{{ card.title }}</h2>
		<card-activity />
=======
	<section v-if="card" class="card-details flex f-col">
		<input class="title" type="text" v-model="card.title" />
		<h3>Description</h3>
		<input
			class="desc"
			type="text"
			v-model="card.description"
			placeholder="Add a more detailed description..."
		/>
		<div class="btns flex">
			<button class="save-btn" @click="saveCard">Save</button>
			<button class="cancel-btn" @click="emitClose">Cancel</button>
		</div>
>>>>>>> 4fefb9259cedb422bcd3aa460549e656c3b86341
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
		emitClose() {
			this.$emit('close');
			this.card = null;
		},
		saveCard() {
			this.$store.dispatch({ type: 'saveCard', card: this.card })
			this.emitClose();
		}
<<<<<<< HEAD
	},	
	created() {
		const cardId = this.$route.params.cardId
		this.$store.commit({type:'updateCurrCard', cardId})
		this.card = this.$store.getters.currCard;	
	},
	components: {
		cardActivity
=======
	},
	created() {
		const cardId = this.$route.params.cardId;
		this.$store.commit({ type: 'setCurrCard', cardId });
		this.card = JSON.parse(JSON.stringify(this.$store.getters.currCard));
>>>>>>> 4fefb9259cedb422bcd3aa460549e656c3b86341
	}
}
</script>
