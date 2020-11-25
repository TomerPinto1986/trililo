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
		</div>
=======
		<draggable v-model="myList" class="group-info flex f-center wrap">
			<transition-group>
				<card-preview
					v-for="card in group.cards"
					:key="card.id"
					:card="card"
					@click.native="openDetails(card.id)"
					@dragend="haa($event)"
				/>
				<form v-if="isAdding" @submit.prevent="saveCard">
					<input type="text" v-model="newCardTxt" />
					<button>Save</button>
				</form>
			</transition-group>
		</draggable>
>>>>>>> 1df1a6ba95eb8a1056a9b18c724167affef2d74a
		<button v-if="!isAdding" @click="addCard">+ Add another card</button>
	</section>
</template>

<script>
import draggable from 'vuedraggable'
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
			isEdit: false
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
		haa(ev) {
			console.log(ev)
		}
	},
	computed: {
		myList: {
			get() {
				console.log('value')
				return this.$store.state.myList
			},
			set(value) {
				console.log(value)
				// this.$store.commit('updateList', value)
			}
		}
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

