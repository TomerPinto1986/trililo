<template>
	<section v-if="group" class="group flex f-col">
		<div class="group-header">
			<input
				type="text"
				class="title"
				v-model="group.title"
				@change="emitChange"
			/>
			<button @click="toggleEdit()">...</button>
			<div v-if="isEdit" class="group-edit flex f-col">
				<button @click="emitDelete(group.id)">Delete Group</button>
			</div>
		</div>
		<draggable
			class="drag-area"
			ghostClass="ghost"
			chosenClass="chosen"
			dragClass="drag"
			:list="group.cards"
			:group="'group'"
			:forceFallback="true"
			:emptyInsertThreshold="100"
			@change="update($event)"
			@start="isDrag = true"
			@end="isDrag = false"
		>
			<card-preview
				v-for="(card, idx) in cardsToShow"
				:key="card.id"
				:data-id="idx"
				:card="card"
				:labels="labels"
				@click.native="openDetails(card.id)"
			/>
		</draggable>
		<div class="add-card">
			<form v-if="isAdding" @submit.prevent="saveCard">
				<input ref="card-title" type="text" v-model="newCardTxt" />
				<button>Save</button>
			</form>
			<button v-if="!isAdding" @click="addCard">+ {{ addBtnTxt }}</button>
		</div>
	</section>
</template>

<script>
import draggable from 'vuedraggable'
import cardPreview from '../card/card-preview.cmp';

export default {
	props: {
		group: Object,
		labels: Array,
		filterBy: Object
	},
	data() {
		return {
			isAdding: false,
			newCardTxt: '',
			isEdit: false,
			isDrag: false,
			cards: [],
		}
	},
	computed: {
		addBtnTxt() {
			return (this.group.cards.length) ? 'Add another card' : 'Add a card';
		},
		cardsToShow() {
			if(!this.filterBy) return this.group.cards
			console.log(this.filterBy)
			const cards = this.group.cards.filter(card => {
				// console.log(card)
				return card.title.toLowerCase().includes(this.filterBy.txt.toLowerCase()) && (card.labels && card.labels.some(label => console.log(label)))
			})
			console.log(cards)
			return cards
		}
	},
	methods: {
		toggleEdit() {
			this.isEdit = !this.isEdit;
		},
		addCard() {
			this.isAdding = true;
			setTimeout(() => this.$refs['card-title'].focus(), 0);

		},
		saveCard() {
			if (this.newCardTxt) this.$emit('newCard', this.newCardTxt, this.group.id)
			this.newCardTxt = ''
			this.isAdding = false;
		},
		openDetails(cardId) {
			document.body.querySelector('.screen').style.display = 'block';
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}/card/${cardId}`)
		},
		emitChange() {
			this.$emit('change', this.group)
		},
		emitDelete(groupId) {
			this.$emit('delete', groupId)
		},
		update() {
			this.emitChange();
		},

	},
	components: {
		cardPreview,
		draggable
	}
};
</script>

