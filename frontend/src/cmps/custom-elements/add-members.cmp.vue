<template>
    <section class="add-members" @click.stop>
        <h3>Members</h3>
        <input
            type="text"
            placeholder="Serach members"
            @keyup="filter"
            v-model="memberSearch"
        />
        <ul>
            <li v-for="user in membersToShow" class="flex" :key="user._id">
                <span class="card-member flex" @click="toggleMember(user._id)">
                    <avatar :size="35" :username="user.username"></avatar>
                    <span>
                        {{ user.username }}
                    </span>
                </span>
                <i class="fas fa-check" v-if="isMember(user._id)"></i>
            </li>
        </ul>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
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
        avatar
    }
}
</script>

<style>
</style>