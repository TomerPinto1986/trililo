<template>
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
		emitClose() {
			this.$emit('close');
			this.card = null;
		},
		saveCard() {
			this.$store.dispatch({ type: 'saveCard', card: this.card })
			this.emitClose();
		}
	},
	created() {
		const cardId = this.$route.params.cardId;
		this.$store.commit({ type: 'setCurrCard', cardId });
		this.card = JSON.parse(JSON.stringify(this.$store.getters.currCard));
	}

}
</script>
