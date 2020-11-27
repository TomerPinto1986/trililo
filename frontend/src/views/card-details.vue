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
		<card-activity />
		<div class="actions">
			<button>Members</button>
			<button>Labels</button>
			<button>Checklist</button>
			<button>Due Date</button>
			<button>Attachment</button>
			<button>Cover</button>
			<button>Copy</button>
			<button class="dlt-btn" @click="emitDelete">Delete Card</button>
			<button class="move-btn" @click="emitMove">Move</button>
		</div>
		<div class="btns flex">
			<button class="save-btn" @click="emitSave">Save</button>
			<button class="cancel-btn" @click="emitClose">Cancel</button>
		</div>
		<div v-if="isPopUp">
			<card-move :groups="getCurrBoard.groups" :group="getCurrGroup" :currPosition="getCurrPosition" @moveCard="moveCard" />
		</div>
	</section>
</template>

<script>
import cardActivity from '../cmps/card/card-activity.cmp';
import cardMove from '../cmps/card/card-move.cmp';

export default {
	data() {
		return {
			card: null,
			board: '',
			isPopUp: false,
			currPopUp: null,
		}
	},
	computed: {
		getCurrBoard(){
			return this.$store.getters.currBoard
		},
		getCurrGroup() {
			return this.$store.getters.currGroup;
		},
		getCurrPosition(){
			return this.getCurrGroup.cards.findIndex(card => card.id === this.card.id) + 1;
		}
	},
	methods: {
		emitClose() {
			this.$emit('close');
		},
		emitSave() {
			this.emitClose();
			this.$emit('saveCard', this.card)
		},
		emitDelete() {
			this.emitClose();
			this.$emit('deleteCard', this.card.id)
		},

		// for later on when we will make a pop up cmp
		emitMove(){
			this.currPopUp = 'move';
			this.isPopUp = true;
		},
		moveCard(status){
			this.$store.commit({type: 'updateCardStatus', status});
			const newBoard = this.$store.getters.currBoard
			this.$store.dispatch({ type: 'updateBoard', newBoard})
			this.isPopUp = false;
		}
	},
	components: {
		cardActivity,
		cardMove
	},
	created() {
		const cardId = this.$route.params.cardId
		this.$store.commit({ type: 'setCurrCard', cardId })
		this.card = this.$store.getters.currCard;
		this.board = this.$store.getters.currBoard;
	},
	destroyed() {
		this.$store.commit({ type: 'updateCurrCard', card: null })
		this.card = null;
	}
}
</script>
