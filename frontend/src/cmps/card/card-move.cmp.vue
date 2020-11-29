<template>
	<section class="card-move">
		<h3>Move Card</h3>
		<h3>Select Destenation</h3>
		<div >
			<select-list
				@changeCardGroup="changeCardGroup"
				:groups="groups"
				:title="group.title"
			></select-list>
			<select-position
				@changeCardPosition="changeCardPosition"
				:cards="getCards"
				:diff="getDiff"
				:currPosition="getCurrPosition"
			></select-position>
			<button @click.stop="emitMove">Move</button>
		</div>
	</section>
</template>

<script>
import selectList from '../custom-elements/select-list.cmp';
import selectPosition from '../custom-elements/select-position.cmp';

export default {
	props: {
		groups: Array,
		group: Object,
		currPosition: Number
	},
	data() {
		return {
			newCardGroupId: this.group.id,
			newCardPosition: null
		}
	},
	computed: {
		getCards() {
			const group = this.groups.find(group => group.id === this.newCardGroupId);
			return group.cards;
		},
		getDiff() {
			console.log(this.newCardGroupId === this.group.id);
			return (this.newCardGroupId === this.group.id) ? 0 : 1;
		},
		getCurrPosition() {
			if (this.newCardGroupId) {
				const group = this.groups.find(group => group.id === this.newCardGroupId);
				return group.cards.length + '';
			}
			return this.currPosition + '';
		},
	},
	methods: {
		changeCardGroup(groupId) {
			this.newCardGroupId = groupId;
		},
		changeCardPosition(position) {
			this.newCardPosition = position;
		},
		emitMove() {
			console.log(this.newCardGroupId, this.newCardPosition);
			const status = {
				startPos: this.currPosition - 1,
				endPos: this.newCardPosition ? this.newCardPosition - 1 : null,
				startGroup: this.group.id,
				endGroup: this.newCardGroupId
			}
			console.log(status);
			this.$emit('moveCard', status)
		}
	},
	components: {
		selectList,
		selectPosition
	}
}
</script>

<style>
</style>