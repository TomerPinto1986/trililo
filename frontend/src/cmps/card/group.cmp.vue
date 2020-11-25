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
		<button @click="addCard()">+ Add another card</button>
		<card-details v-if="isDetailsShowing" @close="closeDetails" />
	</section>
</template>

<script>
import cardPreview from './card-preview.cmp';
import cardDetails from '@/views/card-details';

export default {
	props: {
		group: Object
	},
	data() {
		return {
			isDetailsShowing: false
		}
	},
	methods: {
		toggleSmallEditCard(groupId) {
			console.log('open small list edit', groupId);
		},
		addCard() {
			console.log('Add new card:', this.group);
		},
		openDetails(cardId) {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}/card/${cardId}`)
			this.isDetailsShowing = true;
		},
		closeDetails() {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}`)
			this.isDetailsShowing = false;
		}

	},
	components: {
		cardPreview,
		cardDetails
	}
};
</script>
