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
			<input type="text" v-model="newCard.title" />
			<button>Save</button>
		</form>
		<button v-if="!isAdding" @click="addCard()">+ Add another card</button>
		<card-details v-if="isDetails" @close="emitClose" />
	</section>
</template>

<script>
import cardPreview from '../card/card-preview.cmp';
import cardDetails from '@/views/card-details';

export default {
	props: {
		group: Object,
		isDetails: Boolean
	},
	data() {
		return {
			isAdding: false,
			newCard: null
		}
	},
	methods: {
		toggleSmallEditCard(groupId) {
			console.log('open small list edit', groupId);
		},
		addCard() {
			this.isAdding = true;
			var emptyCard = this.$store.getters.emptyCard;
			this.newCard = JSON.parse(JSON.stringify(emptyCard))
		},
		saveCard() {
			this.$store.dispatch({ type: 'addCard', card: this.newCard, groupId: this.group.id})
			this.isAdding = false;
			const emptyCard = this.$store.getters.emptyCard;
			this.newCard = JSON.parse(JSON.stringify(emptyCard))
			this.$emit('cardChange')
		},
		openDetails(cardId) {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}/card/${cardId}`)
		},
		emitClose() {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}`)
			this.$emit('close')
		}
	},
	computed: {
	},
	components: {
		cardPreview,
		cardDetails
	}
};
</script>

