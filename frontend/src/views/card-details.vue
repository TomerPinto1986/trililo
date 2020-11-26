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
		</div>
		<div class="btns flex">
			<button class="save-btn" @click="emitSave">Save</button>
			<button class="cancel-btn" @click="emitClose">Cancel</button>
		</div>
	</section>
</template>

<script>
import cardActivity from '../cmps/card/card-activity.cmp';

export default {
	data() {
		return {
			card: null
		}
	},
	computed: {},
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
		}
	},
	components: {
		cardActivity
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
