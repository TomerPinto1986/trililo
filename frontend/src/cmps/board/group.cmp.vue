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
		<button v-if="!isAdding" @click="addCard">+ Add another card</button>
	
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
		},
		saveCard() {
			if (this.newCardTxt) {
				this.$emit('newCard', this.newCardTxt, this.group.id)
			}
			this.newCardTxt = ''
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

