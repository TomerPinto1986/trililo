<template>
	<section class="board-menu">
		<i class="fas fa-chevron-left btn back-btn flex f-center" v-if="isSub" @click="backToMenu"></i>
		<i @click="emitClose" class="fas fa-times btn close-btn flex f-center"></i>
		<div class="board-menu-header">
			<h3>{{ menuTitle }}</h3>
			<hr class="menu-header-divider" />
		</div>
		<template v-if="!isSub">
			<div class="board-menu-container flex f-col">
				<div class="board-menu-nav">
					<span class="board-menu-nav-item" @click="toggleBg">
						<i class="fas fa-image icon"></i>
						Change Background
					</span>
					<span class="board-menu-nav-item" @click="emitDeleteBoard">
						<i class="fas fa-trash-alt icon"></i>
						Delete Board
					</span>
					<span class="board-menu-nav-item" @click="toggleSearch">
						<i class="fas fa-search icon"></i>
						Search Cards
					</span>
				</div>
				<hr />
				<span class="menu-section-header">
					<i class="fas fa-clipboard-list icon"></i>
					<h3>Activities</h3>
				</span>
				<div class="activity">
					<activity-preview
						v-for="activity in board.activities"
						:key="activity.id"
						:activity="activity"
						@openCard="openCard"
					/>
				</div>
			</div>
		</template>
		<div class="sub-menu board-menu-container" v-else>
			<bg-picker v-if="isBg" @changeBgc="emitChange" />
			<board-search v-if="isSearch" :board="board" @filter="emitFilter" />
		</div>
	</section>
</template>

<script>
import activityPreview from '../../activity-preview.cmp.vue'
import boardSearch from './board-search.cmp'
import bgPicker from './bg-picker.cmp'

export default {
	props: {
		board: Object
	},
	data() {
		return {
			isBg: false,
			isSearch: false,
			isSub: false,

		}
	},
	computed: {
		menuTitle() {
			return (!this.isSub) ? 'Menu' : (this.isBg) ? 'Change Background' : 'Search Cards';
		}
	},
	methods: {
		toggleBg() {
			this.isBg = true;
			this.isSub = true;
		},
		toggleSearch() {
			this.isSearch = true;
			this.isSub = true;
		},
		emitClose() {
			this.$emit('close');
		},
		emitChange(bgc) {
			this.$emit('changeBgc', bgc);
		},
		emitDeleteBoard() {
			if (!confirm('Are you sure?')) return;
			this.$emit('deleteBoard', this.board._id)
		},
		openCard(cardId) {
			var cardIdx;
			this.board.groups.forEach(group => {
				cardIdx = group.cards.findIndex(currCard => currCard.id === cardId);
				if (cardIdx !== -1) {
					this.$router.push(`/board/${this.board._id}/card/${cardId}`)
				}
			})
		},
		emitFilter(filterBy) {
			this.$emit('filter', filterBy)
		},
		backToMenu() {
			this.isSub = false;
			this.isBg = false;
			this.isSearch = false;
		}
	},
	created() {
	},
	components: {
		activityPreview,
		boardSearch,
		bgPicker
	}
}
</script>

<style>
</style>