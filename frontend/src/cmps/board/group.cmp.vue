<template>
	<section v-if="currGroup" class="group flex f-col f-center">
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
<<<<<<< HEAD
		<div class="group-info flex f-center wrap">
=======
		<draggable
			class="drag-area"
			:list="currGroup.cards"
			:animation="200"
			:group="'status'"
			@add="onAdd($event, true)"
			@change="update($event)"
		>
			<div
				v-for="(card, idx) in currGroup.cards"
				:key="card.id"
				:data-id="idx"
			>
>>>>>>> a181dec7c63466d88007e66d2a60de72faacac1c
				<card-preview
					:card="card"
					@click.native="openDetails(card.id)"
				/>
<<<<<<< HEAD
				<form v-if="isAdding" @submit.prevent="saveCard">
					<input type="text" v-model="newCardTxt" />
					<button>Save</button>
				</form>
		</div>
		<button v-if="!isAdding" @click="addCard">+ Add another card</button>
=======
			</div>
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
>>>>>>> a181dec7c63466d88007e66d2a60de72faacac1c
	</section>
</template>

<script>
// import draggable from 'vuedraggable'
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
		checkMove(ev) {
			window.console.log("Future index: " + ev.draggedContext.futureIndex);
		},
		onAdd(event, status) {
			console.log('adding', event, status)
			let id = event.item.getAttribute('data-id');
			console.log(id)
		},
		update() {
			this.emitChange();
		}
	},
	computed: {
	},
	components: {
		cardPreview,
		// draggable
	},
	created() {
		this.currGroup = JSON.parse(JSON.stringify(this.group))
	}
};
</script>

