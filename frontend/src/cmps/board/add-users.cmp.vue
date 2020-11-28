<template>
    <section class="add-users">
        <h3>Users</h3> <button @click="onClose">x</button>
        <input type="text" placeholder="Serach members" @keyup="filter" v-model="userSearch">
        <ul>
            <li v-for="user in usersToShow" :key="user._id" class="flex">
                    <span class="board-user flex" @click="toggleUser(user._id)"><avatar :size=35 :username="user.username" ></avatar><span> {{user.username}}</span></span>
                    <i class="fas fa-check" v-if="isUser(user._id)"></i>
            </li>
        </ul>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
export default {
    props:{
        allUsers: Array,
        boardUsers: Array
    },
    data() {
        return {
            userSearch: null,
            filterTxt: ''
        }
    },
    computed:{
        usersToShow(){
            console.log(this.allUsers);
            return this.allUsers.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
        },
    },
    methods: {
        filter(){
            this.filterTxt = this.userSearch;
        },
        toggleUser(userId){
            this.$emit('updateUsers',userId);
        },
        isUser(userId){
            return this.boardUsers.some( boardUser => boardUser._id === userId);
        },
        onClose() {
            this.$emit('closeUsers');
        },
        
    },
    components: {
        avatar
    }

}
</script>

<style>

</style>