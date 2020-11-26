<template>
    <section class="card-move">
        <h3>Move Card</h3>
        <h3>Select Destenation</h3>
        <form @submit.prevent="emitMove">
            <select-list @changeCardGroup="changeCardGroup" :groups="groups"></select-list>
            <!-- <select-position @changeCardPosition="changeCardGroup" :groups="groups"></select-position> -->
            <button>Move</button>
        </form>
    </section>
</template>

<script>
import selectList from '../custom-elements/select-list.cmp';

export default {
    props: {
        groups: Array
    },
    data() {
        return {
            newCardGroupId: null,
            newCardPosition: null
        }
    },
    methods:{
        changeCardGroup(groupId){
            this.newCardGroup = groupId;
        },
        emitMove(){
            this.$emit('moveCard',groupId,position)
        }
    },


    components: {
        selectList
    }
}
</script>

<style>
</style>