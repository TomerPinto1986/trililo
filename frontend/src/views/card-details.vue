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
			<button class="dlt-btn" @click="emitDelete">Delete Card</button>
			<button class="move-btn" @click="emitMove">Move</button>
		</div>
		<div class="btns flex">
			<button class="save-btn" @click="emitSave">Save</button>
			<button class="cancel-btn" @click="emitClose">Cancel</button>
		</div>
		<div v-if="isPopUp">
			<card-move :groups="getCurrBoard.groups" />
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
			isPopUp: false,
			currPopUp: null,
		}
	},
	computed: {
		getCurrBoard(){
		console.log(this.$store.getters.currBoard);		
			return this.$store.getters.currBoard
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
		emitMove(){
			this.currPopUp = 'move';
			this.isPopUp = true;
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
		console.log(this.card)
	},
	destroyed() {
		this.$store.commit({ type: 'updateCurrCard', card: null })
		this.card = null;
	}
}
</script>
