<template>
<<<<<<< HEAD
	<section class="card-move">
		<h3>Move Card</h3>
		<h3>Select Destenation</h3>
		<form @submit.prevent="emitMove">
			<select-list
				@changeCardGroup="changeCardGroup"
				:groups="groups"
			></select-list>
			<!-- <select-position @changeCardPosition="changeCardGroup" :groups="groups"></select-position> -->
			<button>Move</button>
		</form>
	</section>
=======
    <section class="card-move">
        <h3>Move Card</h3>
        <h3>Select Destenation</h3>
        <form @submit.prevent="emitMove">
            <select-list @changeCardGroup="changeCardGroup" :groups="groups" :title="group.title"></select-list>
            <select-position @changeCardPosition="changeCardPosition" :cards="getCards" :diff="getDiff" :currPosition="getCurrPosition" ></select-position>
            <button>Move</button>
        </form>
    </section>
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
</template>

<script>
import selectList from '../custom-elements/select-list.cmp';
import selectPosition from '../custom-elements/select-position.cmp';

export default {
<<<<<<< HEAD
	props: {
		groups: Array
	},
	data() {
		return {
			newCardGroupId: null,
			newCardPosition: null
		}
	},
	methods: {
		changeCardGroup(groupId) {
			this.newCardGroup = groupId;
		},
		emitMove() {
			this.$emit('moveCard', this.newCardGroup, this.newCardPosition)
		}
	},


	components: {
		selectList
	}
=======
    props: {
        groups: Array,
        group: Object,
        currPosition: Number
    },
    data() {
        return {
            newCardGroupId: this.group.id,
            newCardPosition: null
        }
    },
    computed:{
        getCards(){
            const group = this.groups.find( group => group.id === this.newCardGroupId);
            return group.cards;
        },
        getDiff(){
            console.log(this.newCardGroupId === this.group.id);
            return (this.newCardGroupId === this.group.id) ? 0 : 1;
        },
        getCurrPosition(){
            if (this.newCardGroupId) {
                const group = this.groups.find( group => group.id === this.newCardGroupId);
                return group.cards.length + '';
            }
            return this.currPosition + '';
        },
    },
    methods:{
        changeCardGroup(groupId) {
            this.newCardGroupId = groupId;
        },
        changeCardPosition(position) {
            this.newCardPosition = position;
        },
        emitMove(){
            console.log(this.newCardGroupId,this.newCardPosition);
            const status = {
                startPos: this.currPosition - 1,
                endPos: this.newCardPosition ? this.newCardPosition-1 : null,
                startGroup: this.group.id,
                endGroup: this.newCardGroupId
            }
            console.log(status);
            // if (!status.endPos) status.endPos = 
            this.$emit('moveCard', status)
        }
    },


    components: {
        selectList,
        selectPosition
    }
>>>>>>> 65d62ee2647be18c62b2feb07315ffd3e5e18dab
}
</script>

<style>
</style>