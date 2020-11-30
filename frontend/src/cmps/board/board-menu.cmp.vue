<template>
	<section class="board-menu flex f-col">
		<i @click="emitClose" class="fas fa-times close-btn"></i>
		<h2>Menu</h2>
		<hr />
		<div class="board-actions flex f-col">
			<span @click="toggleBg">Change Background</span>
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

			<span @click="emitDeleteBoard">Delete Board</span>
			<hr />
		</div>
		<board-search :board="board" @filter="emitFilter" />
		<h3>Activities</h3>
		<div class="activity">
			<activity-preview
				v-for="activity in board.activities"
				:key="activity.id"
				:activity="activity"
				@click="openCard"
			/>
		</div>
	</section>
</template>

<script>
import activityPreview from '../activity-preview.cmp'
import boardSearch from './board-search.cmp'

export default {
	props: {
		board: Object
	},
	data() {
		return {
			isBg: false,
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
				require('../../assets/bgs/bg1.jpg'),
				require('../../assets/bgs/bg2.jpg'),
				require('../../assets/bgs/bg3.jpg'),
				require('../../assets/bgs/bg4.jpg'),
				require('../../assets/bgs/bg5.jpg'),
				require('../../assets/bgs/bg6.jpg'),
			]
		}
	},
	methods: {
		toggleBg() {
			this.isBg = !this.isBg;
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
		openCard() {

		},
		emitFilter() {

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