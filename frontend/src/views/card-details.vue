<template>
    <section v-if="card" class="card-details flex f-col">
        <input class="title" type="text" v-model="card.title" />
        <h3>Description</h3>
		<span v-if="card.dueDate">Due Date: {{localTime}}</span>
        <!-- Turn to prop -->
        <input
            class="desc"
            type="text"
            v-model="card.description"
            placeholder="Add a more detailed description..."
        />
        <card-activity />
        <div class="actions">
            <button @click="onAddMembers">Members</button>
            <button>Labels</button>
            <button>Checklist</button>
            <button>Attachment</button>
            <button @click="setDate">Set Date</button>
            <button>Cover</button>
            <button>Copy</button>
            <button class="dlt-btn" @click="emitDelete">Delete Card</button>
            <button class="move-btn" @click="emitMove">Move</button>
        </div>
        <div class="btns flex">
            <!-- <button class="save-btn" @click="emitSave">Save</button> -->
            <button class="cancel-btn" @click="emitClose">Close</button>
        </div>
        <div v-if="isPopUp">
            <card-move
                v-if="move"
                :groups="board.groups"
                :group="getCurrGroup"
                :currPosition="getCurrPosition"
                @moveCard="moveCard"
            />
            <date-picker v-if="dueDate" @setDate="setNewDate" />
            <add-members
                v-if="isAddMembers"
                :cardMembers="cardMembers()"
                :boardMembers="boardMembers"
                @closeMembers="closeMembers"
                @updateMembers="updateMembers"
            />
        </div>
    </section>
</template>

<script>
import cardActivity from '@/cmps/card/card-activity.cmp';
import cardMove from '@/cmps/card/card-move.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import { utilService } from '@/services/util.service';
import addMembers from '@/cmps/custom-elements/add-members.cmp'

export default {
    data() {
        return {
            card: null,
            isPopUp: false,
            currPopUp: null,
        }
    },
    computed: {
		localTime(){
			return new Date(this.card.dueDate).toLocaleTime();
		},
        boardMembers() {
            if (!this.board.isPrivate) return this.$store.getters.users;
            return this.board.members;
        },
        board() {
            return utilService.deepCopy(this.$store.getters.currBoard)
        },
        getCurrGroup() {
            const group = this.board.groups.find(group => group.cards.some(card => card.id === this.card.id))
            return group;
        },
        getCurrPosition() {
            return this.getCurrGroup.cards.findIndex(card => card.id === this.card.id) + 1;
        },
        move() {
            return this.currPopUp === 'move';
        },
        dueDate() {
            return this.currPopUp === 'duedate';
        },
        isAddMembers() {
            return this.currPopUp === 'member';
        }
    },
    methods: {
        emitClose() {
            this.$emit('close');
        },
        emitSave() {
            this.emitClose();
            this.$emit('saveCard', this.card)
        },
        emitDelete() {
            this.emitClose();
            this.$emit('deleteCard', this.card.id)
        },
        // for later on when we will make a pop up cmp
        emitMove() {
            this.currPopUp = 'move';
            this.isPopUp = true;
        },
        setDate() {
            this.currPopUp = 'duedate';
            this.isPopUp = true;
        },
        setNewDate(dueDate) {
            this.card.dueDate = dueDate;
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(card => card.id === this.card.id)
                if (cardIdx !== -1) {
                    group.cards.splice(cardIdx, 1, this.card)
                }
            })
			this.$store.dispatch({ type: 'updateBoard', board }); 
			this.isPopUp = false;

        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board });
            this.isPopUp = false;
        },
        onAddMembers() {
            this.currPopUp = 'member';
            this.isPopUp = true;
        },
        closeMembers() {
            this.isPopUp = false;
        },
        updateMembers(userId) {
            const board = this.board;
            const memberIdx = this.card.members.findIndex(member => member._id === userId)
            if (memberIdx === -1) {
                const newUser = this.$store.getters.users.find(user => user._id === userId);
                console.log(newUser);
                const newMember = {
                    _id: newUser._id,
                    username: newUser.username,
                    imgUrl: newUser.imgUrl
                };
                this.card.members.push(newMember);
            } else {
                this.card.members.splice(memberIdx, 1);
            }
            this.$store.dispatch({ type: 'updateBoard', board })
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            console.log('card members', this.card.members);
            return this.card.members
        },
    },
    created() {
        const cardId = this.$route.params.cardId
        this.$store.commit({ type: 'setCurrCard', cardId })
        // this.card = utilService.deepCopy(this.$store.getters.currCard);
        this.card = this.$store.getters.currCard;
    },
    destroyed() {
        this.$store.commit({ type: 'updateCurrCard', card: null })
        this.card = null;
    },
    components: {
        cardActivity,
        cardMove,
        datePicker,
        addMembers
    }
}
</script>
