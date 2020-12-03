<template>
	<section data-name="group-menu" class="group-menu" :class="clickPos">
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
	props:{
		clickPos:String
	},
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
			this.$emit('backToMenu')
		},
		checkClickPos(ev){
			console.dir(ev.target)
		}

	},
	created(){
		window.addEventListener('click', this.checkClickPos)
	},
	destroyed(){
		window.removeEventListener('click', this.checkClickPos)
	}
}
</script>
