<template>
	<section class="group flex f-col f-center">
		<div class="group-header">
			{{ group.title }}
			<button @click="toggleSmallEditCard(group.id)">...</button>
		</div>
		<card-preview
			v-for="card in group.cards"
			:key="card.id"
			:card="card"
			@click.native="openDetails(card.id)"
		/>
		<form v-if="isAdding" @submit.prevent="saveCard">
			<input type="text" v-model="newCardTxt" />
			<button>Save</button>
		</form>
<<<<<<< HEAD
		<button v-if="!isAdding" @click="addCard">+ Add another card</button>
	
=======
		<button v-if="!isAdding" @click="addCard()">+ Add another card</button>
		<card-details v-if="isDetails" @close="emitClose" />
>>>>>>> d5db9fe961991fd0f76258dc957fdd2967100523
	</section>
</template>

<script>
import cardPreview from '../card/card-preview.cmp';

export default {
	props: {
		group: Object,
	},
	data() {
		return {
			isAdding: false,
			newCardTxt: ''
		}
	},
	methods: {
		toggleSmallEditCard(groupId) {
			console.log('open small list edit', groupId);
		},
		addCard() {
			this.isAdding = true;
<<<<<<< HEAD
		},
		saveCard() {
			if (this.newCardTxt) {
				this.$emit('newCard', this.newCardTxt, this.group.id)
			}
			this.newCardTxt = ''
=======
			const emptyCard = this.$store.getters.emptyCard;
			this.newCard = JSON.parse(JSON.stringify(emptyCard))
		},
		saveCard() {
			this.$store.dispatch({ type: 'addCard', card: this.newCard, groupId: this.group.id})
>>>>>>> d5db9fe961991fd0f76258dc957fdd2967100523
			this.isAdding = false;
			const emptyCard = this.$store.getters.emptyCard;
			this.newCard = JSON.parse(JSON.stringify(emptyCard))
			this.$emit('cardChange')
		},
		openDetails(cardId) {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}/card/${cardId}`)
		}
	},
	computed: {
	},
	components: {
		cardPreview,
	}
};
</script>

