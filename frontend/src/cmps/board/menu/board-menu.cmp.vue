<template>
	<section class="board-menu">
		<i @click="emitClose" class="fas fa-times close-btn flex f-center"></i>
		<div class="board-menu-header">
			<h3>Menu</h3>
			<hr class="menu-header-divider" />
		</div>

		<div class="board-menu-container flex f-col">
			<div class="board-menu-nav">
				<span class="board-menu-nav-item" @click="toggleBg">
					<i class="fas fa-image icon"></i>
					Change Background
				</span>
				<div v-if="isBg" class="background flex f-center wrap">
					<div
						v-for="(color, idx) in colors"
						:key="color"
						:class="`bgc bgc-${idx + 1}`"
						@click="emitChange(color)"
					></div>
					<div v-for="(src, idx) in srcs" :key="src">
						<img @click="emitChange(`${idx}`)" :src="src" />
					</div>
				</div>

				<span class="board-menu-nav-item" @click="emitDeleteBoard">
					<i class="fas fa-trash-alt icon"></i>
					Delete Board
				</span>
				<span class="board-menu-nav-item" @click="toggleSearch">
					<i class="fas fa-search icon"></i>
					Search Cards
				</span>
			</div>
			<board-search v-if="isSearch" :board="board" @filter="emitFilter" />
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
	</section>
</template>

<script>
import activityPreview from '../../activity-preview.cmp.vue'
import boardSearch from '../board-search.cmp.vue'

export default {
	props: {
		board: Object
	},
	data() {
		return {
			isBg: false,
			isSearch: false,
			colors: [
				'rgb(46, 121, 186)',
				'rgb(72, 171, 200)',
				'rgb(106, 188, 114)',
				'rgb(98, 149, 70)',
				'rgb(132, 99, 154)',
				'rgb(191, 98, 143)',
				'rgb(164, 76, 56)',
				'rgb(202, 146, 71)'
			],
			srcs: [
				require('../../../assets/bgs/bg1.jpg'),
				require('../../../assets/bgs/bg2.jpg'),
				require('../../../assets/bgs/bg3.jpg'),
				require('../../../assets/bgs/bg4.jpg'),
				require('../../../assets/bgs/bg5.jpg'),
				require('../../../assets/bgs/bg6.jpg'),
			]
		}
	},
	methods: {
		toggleBg() {
			this.isBg = !this.isBg;
		},
		toggleSearch() {
			this.isSearch = !this.isSearch;
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
		}
	},
	created() {
	},
	components: {
		activityPreview,
		boardSearch
	}
}
</script>

<style>
</style>