<template>
	<section class="board-menu flex f-col">
		<i @click="emitClose" class="fas fa-times close-btn"></i>
		<h2>Menu</h2>
		<hr />
		<div class="board-actions flex f-col">
			<span @click="toggleBgc">Change Background</span>
			<div v-if="isBgc" class="background flex f-center wrap">
				<div
					v-for="idx in 8"
					:key="idx + 10"
					:class="`bgc bgc-${idx}`"
					@click="emitChange(`bgc-${idx}`)"
				></div>
				<div v-for="idx in 5" :key="idx">
					<img
						@click="emitChange(`${idx}`)"
						:src="require(`../../assets/bgs/${idx}.jpg`)"
					/>
				</div>
			</div>

			<span>Delete Board</span>
			<hr />
		</div>
		<div class="activity"></div>
	</section>
</template>

<script>


export default {
	props: {
		board: Object
	},
	data() {
		return {
			isBgc: false,
		}
	},
	methods: {
		toggleBgc() {
			console.log('s')
			this.isBgc = !this.isBgc;
		},
		emitClose() {
			this.$emit('close');
		},
		emitChange(bgc) {
			this.$emit('changeBgc', bgc);
		}
	},
	created() {
	}
}
</script>

<style>
</style>