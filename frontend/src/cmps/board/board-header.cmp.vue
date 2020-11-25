<template>
    <section v-if="board" class="board-header">
        <h2>{{board.title}}</h2>
        <div>{{isPrivate}}</div>
        <div class="board-members" v-for="member in boardMembers" :key="member.id">
            <avatar :username="member.username">ss</avatar>
        </div>
        <button class="addMember" @click="addMember">Invite</button>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
export default {
    props: {
        board: Object,
    },
    computed:{
        boardMembers(){
            console.log(this.board);
            return this.board.members;
        },
        isPrivate(){
            return this.board.isPrivate ? 'Private' : 'Public'
        }
    },
    components: {
        avatar
    }
}
</script>

<style>

</style>