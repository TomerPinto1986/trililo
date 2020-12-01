<template>
	<section class="group-menu">
		<div class="header-container">
            <span class="close-btn">
                <i class="el-icon-close" @click="emitClose"></i>
            </span>
			<slot name="header">
				<span class="header"> List Actions </span>
			</slot>
		</div>
		<div class="content">
			<slot name="body">
				<div>Add Card...</div>
				<div>Copy List...</div>
				<div>Move List...</div>
				<hr />
				<div>Sort By...</div>
				<hr />
				<div @click="emitDelete">Delete this List</div>
			</slot>
		</div>
	</section>
</template>

<script>
export default {
methods:{
    emitClose(){
        this.$emit('closeMenu');
    },
    emitDelete(){
        this.$emit('deleteGroup');
    }
}
}
</script>

<style>
</style>