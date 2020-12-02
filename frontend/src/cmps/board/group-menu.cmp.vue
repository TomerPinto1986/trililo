<template>
	<section class="group-menu">
		<div class="header-container">
			<slot name="back-btn"></slot>
			<span class="close-btn">
				<i class="el-icon-close" @click="emitClose"></i>
			</span>
			<slot name="header">
				<span class="header"> List Actions </span>
			</slot>
		</div>
		<slot name="body">
			<div class="content">
				<div @click="emitAdd">Add Card...</div>
				<div @click="emitClone">Clone List...</div>
				<!-- Need to make it work with recursive/itterative to change IDs -->
				<div @click="emitMove">Move List...</div>
				<hr />
				<div @click="emitSort">Sort By...</div>
				<hr />
				<div @click="emitDelete">Delete this List</div>
			</div>
		</slot>
	</section>
</template>

<script>
export default {
	methods: {
		emitClose() {
			this.$emit('closeMenu');
		},
		emitDelete() {
			this.$emit('deleteGroup');
			this.emitClose();
		},
		emitAdd() {
			this.$emit('addCard');
			this.emitClose();
		},
		emitClone() {
			this.$emit('cloneGroup');
			this.emitClose();
		},
		emitMove() {
			this.$emit('openMove');
		},
		emitSort() {
			this.$emit('openSort');
		},
		emitBackToMenu(){
			console.log('ss')
			this.$emit('backToMenu')
		}

	}
}
</script>

<style>
</style>