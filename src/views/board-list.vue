<template>
    <section class="board-list">
        <board-preview v-for="board in boardsForDisplay" :key="board._id" />
        {{boardsForDisplay}}
    </section>    
</template>

<script>
import boardPreview from '../cmps/board/board-preview.cmp';

export default {
computed: {
    boardsForDisplay(){
        console.log(this.$store.getters.boards);
        return this.$store.getters.boards;
    }
},
components:{
    boardPreview
}
}
</script>
