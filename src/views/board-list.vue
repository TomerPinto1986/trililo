<template>
    <section class="board-list">
        <board-preview v-for="board in boardsForDisplay" :key="board._id" />
    </section>    
</template>

<script>
import boardPreview from '../cmps/board/board-preview.cmp';

export default {
computed: {
    boardsForDisplay(){
        return this.$store.getters.boards;
    }
},
components:{
    boardPreview
}
}
</script>

<style>

</style>