<template>
    <section class="add-members" @click.stop>
        <h3>Members</h3>
        <input type="text" placeholder="Serach members" @keyup="filter" v-model="memberSearch">
        <ul>
            <li v-for="user in membersToShow" :key="user._id">
                    <span class="card-member" @click="toggleMember(user._id)">{{user.username}} </span>
                    <i class="fas fa-check" v-if="isMember(user._id)"></i>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    props:{
        boardMembers: Array,
        cardMembers: Array
    },
    data() {
        return {
            memberSearch: null,
            filterTxt: ''
        }
    },
    computed:{
        membersToShow(){
            return this.boardMembers.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
        },
    },
    methods: {
        filter(){
            this.filterTxt = this.memberSearch;
        },
        toggleMember(userId){
            console.log(userId);
            this.$emit('updateMembers',userId);
        },
        isMember(userId){
            return this.cardMembers.some( member => member._id === userId);
        }
    },
    created(){
        console.log('add memebers', this.cardMembers,this.boardMembers);
    }

}
</script>

<style>

</style>