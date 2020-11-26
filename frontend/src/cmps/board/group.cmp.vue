<template>
	<section v-if="currGroup" class="group flex f-col">
		<div class="group-header">
			<input
				type="text"
				class="title"
				v-model="currGroup.title"
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
			:list="currGroup.cards"
			:group="'group'"
			:forceFallback="true"
			@change="update($event)"
			@start="isDrag = true"
			@end="isDrag = false"
		>
			<transition-group
				type="transition"
				:name="!isDrag ? 'flip-list' : null"
			>
				<card-preview
					v-for="(card, idx) in currGroup.cards"
					:key="card.id"
					:data-id="idx"
					:card="card"
					@click.native="openDetails(card.id)"
				/>
<<<<<<< HEAD
			</transition-group>
=======
			</div>
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
		</draggable>
		<div class="add-card">
			<form v-if="isAdding" @submit.prevent="saveCard">
				<input type="text" v-model="newCardTxt" />
				<button>Save</button>
			</form>
			<button v-if="!isAdding" @click="addCard">
				+ Add another card
			</button>
		</div>
	</section>
</template>

<script>
<<<<<<< HEAD
import draggable from 'vuedraggable'
=======
import draggable from 'vuedraggable';
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
import cardPreview from '../card/card-preview.cmp';

export default {
	props: {
		group: Object
	},
	data() {
		return {
			isAdding: false,
			newCardTxt: '',
			currGroup: null,
			isEdit: false,
			isDrag: false
		}
	},
	methods: {
		toggleEdit() {
			this.isEdit = !this.isEdit;
		},
		addCard() {
			this.isAdding = true;
		},
		saveCard() {
			if (this.newCardTxt) this.$emit('newCard', this.newCardTxt, this.group.id)
			this.newCardTxt = ''
			this.isAdding = false;
		},
		openDetails(cardId) {
			const boardId = this.$route.params.boardId
			this.$router.push(`/board/${boardId}/card/${cardId}`)
		},
		emitChange() {
			this.$emit('change', this.currGroup)
		},
		emitDelete(groupId) {
			this.$emit('delete', groupId)
		},
		update() {
			this.emitChange();
		}
	},
	computed: {
	},
	components: {
		cardPreview,
		draggable
	},
	created() {
		this.currGroup = JSON.parse(JSON.stringify(this.group))
	}
};
</script>

