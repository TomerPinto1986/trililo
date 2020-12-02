<template>
	<section v-if="group" class="group flex f-col">
		<div class="group-header">
			<input
				type="text"
				class="title"
				v-model="group.title"
				@change="emitChange"
			/>
			<button @click="toggleMenu">...</button>
			<group-menu
				v-if="isMenu"
				@closeMenu="toggleMenu"
				@deleteGroup="emitDelete(group.id)"
			></group-menu>
			<!-- <div v-if="isMenu" class="group-edit flex f-col">
				<button @click="emitDelete(group.id)">Delete Group</button>
			</div> -->
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
				:activities="activities"
				@click.native="openDetails(card.id)"
			/>
		</draggable>
		<div class="add-card-container">
			<template v-if="isAdding">
				<!-- add closing when pressing outside of textarea -->
				<textarea
					@keydown.enter.prevent
					@keyup.enter="saveCard"
					ref="card-title"
					class="list-card-composer-textarea js-card-title"
					placeholder="Enter a title for this card…"
					maxlength="120"
					v-model="newCardTxt"
				></textarea>
				<div class="add-card-btns flex">
					<button @click="saveCard" class="add-btn">Add Card</button>
					<i
						@click="closeCardAdd"
						class="el-icon-close close-btn"
					></i>
				</div>
			</template>
			<div v-else @click="addCard" class="open-add-btn">
				<i class="el-icon-plus"></i> <span>{{ addBtnTxt }}</span>
			</div>
		</div>
	</section>
</template>

<script>
import draggable from 'vuedraggable'
import cardPreview from '../card/card-preview.cmp';
import groupMenu from './group-menu.cmp'

export default {
	props: {
		group: Object,
		labels: Array,
		activities: Array,
		filterBy: Object,
		isCloseAdd: Boolean
	},
	data() {
		return {
			isAdding: false,
			newCardTxt: '',
			isMenu: false,
			isDrag: false,
		}
	},
	computed: {
		addBtnTxt() {
			return (this.group.cards.length) ? 'Add another card' : 'Add a card';
		},
		cardsToShow() {
			if (!this.filterBy) return this.group.cards
			console.log('filter', this.filterBy)
			const cards = this.group.cards.filter(card => {
				if (!card.labels) card.labels = [];
				if (!card.members) card.members = [];
				return card.title.toLowerCase().includes(this.filterBy.txt.toLowerCase()) &&
					(!this.filterBy.labelsIds.length || this.filterBy.labelsIds.every(id => card.labels.some(label => label.id === id))) &&
					(!this.filterBy.membersIds.length || this.filterBy.membersIds.every(id => card.members.some(member => member._id === id)))
			})
			return cards
		}
	},
	methods: {
		toggleMenu() {
			this.isMenu = !this.isMenu;
		},
		addCard() {
			this.isAdding = true;
			setTimeout(() => this.$refs['card-title'].focus(), 0);
		},
		saveCard() {
			if (!this.newCardTxt) return;
			this.$emit('newCard', this.newCardTxt, this.group.id);
			this.newCardTxt = ''
			this.$refs['card-title'].focus()
		},
		closeCardAdd() {
			this.isAdding = false;
		},
		openDetails(cardId) {
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
		draggable,
		groupMenu
	}
};
</script>

