<template>
    <section v-if="card" class="card-details flex f-col">
        <input class="title" type="text" v-model="card.title" />
        <card-labels :card="card" :board="board" @onUpdateBoard="updateBoard" />
        <h3>Description</h3>
        <!-- Turn to prop -->
        <input
            class="desc"
            type="text"
            v-model="card.description"
            placeholder="Add a more detailed description..."
        />
        <card-activity />
        <div class="actions">
            <button>Members</button>
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
        </div>
    </section>
</template>

<script>
import cardActivity from '@/cmps/card/card-activity.cmp';
import cardMove from '@/cmps/card/card-move.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-labels.cmp';
import { utilService } from '@/services/util.service';

export default {
    data() {
        return {
            card: null,
            isPopUp: false,
            currPopUp: null,
        }
    },
    computed: {
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
            this.isPopUp = false;

        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board
            this.$store.dispatch({ type: 'updateBoard', board })
            this.isPopUp = false;
        },
        updateBoard(board) {
            this.$store.dispatch({ type: 'updateBoard', board });
        }
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
        cardLabels
    }
}
</script>
