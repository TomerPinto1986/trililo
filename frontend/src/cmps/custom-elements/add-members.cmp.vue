<template>
    <section class="add-members" @click.stop>
        <h3>Members</h3>
        <hr>
        <input
            type="text"
            placeholder="Serach members"
            @keyup="filter"
            v-model="memberSearch"
        />
        <ul>
            <h2>board members</h2>
            <li v-for="user in membersToShow" class="flex" :key="user._id">
                <span class="card-member flex" @click="toggleMember(user._id)">
                    <custom-avatar :size="35" :username="user.username" :src="user.imgUrl"/>
                    <span class="username">
                        {{ user.username }}
                    </span>
                </span>
                <i class="fas fa-check" v-if="isMember(user._id)"></i>
            </li>
        </ul>
    </section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
export default {
    props: {
        boardMembers: Array,
        cardMembers: Array
    },
    data() {
        return {
            memberSearch: null,
            filterTxt: ''
        }
    },
    computed: {
        membersToShow() {
            return this.boardMembers.filter(user => user.username.toLowerCase().includes(this.filterTxt.toLowerCase()));
        },
    },
    methods: {
        filter() {
            this.filterTxt = this.memberSearch;
        },
        toggleMember(userId) {
            this.$emit('updateMembers', userId);
        },
        isMember(userId) {
            return this.cardMembers.some(member => member._id === userId);
        }
    },
    components: {
        customAvatar
    }
}
</script>

<style>
</style>