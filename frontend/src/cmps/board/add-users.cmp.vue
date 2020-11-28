<template>
    <section class="add-Users">
        <h3>Users</h3> <button @click="onClose">x</button>
        <input type="text" placeholder="Serach members" @keyup="filter" v-model="memberSearch">
        <ul>
            <li v-for="user in usersToShow" :key="user._id">
                    <span class="board-user" @click="toggleuser(user._id)">{{user.username}} </span>
                    <i class="fas fa-check" v-if="isuser(user._id)"></i>
            </li>
        </ul>
    </section>
</template>

<script>
export default {
    props:{
        boardusers: Array,
    },
    data() {
        return {
            userSearch: null,
            filterTxt: ''
        }
    },
    computed:{
        usersToShow(){
            return this.boardusers.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
        },
    },
    methods: {
        filter(){
            this.filterTxt = this.userSearch;
        },
        toggleuser(userId){
            console.log(userId);
            this.$emit('updateusers',userId);
        },
        onClose() {
            this.$emit('closeusers');
        },
        
    },
    created(){
        console.log('add users',this.boardusers);
    }

}
</script>

<style>

</style>