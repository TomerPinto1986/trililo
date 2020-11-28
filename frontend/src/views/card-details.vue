<template>
    <section v-if="card" class="card-details flex f-col">
        <div class="card-header" :style="headerStyle"></div>
        <div class="card-info">
            <input
                class="title"
                type="text"
                v-model="card.title"
                @blur="updateBoard"
            />
            <div class="flex" v-if="card.members && card.members.length">
                <span>Members: </span>
                <span v-for="member in card.members" :key="member._id"
                    ><avatar :size="35" :username="member.username"></avatar
                ></span>
                <span @click="onAddMembers"
                    ><avatar :size="35" :username="'+'"></avatar
                ></span>
            </div>
            <card-labels
                :card="card"
                :board="board"
                @onUpdateBoard="updateBoard"
            />
            <h3>Description</h3>
            <span @click="setDate" v-if="card.dueDate"
                >Due Date: {{ localTime }}</span
            >
            <!-- Turn to prop -->
            <textarea
                cols="50"
                rows="5"
                class="desc"
                type="text"
                v-model="card.description"
                placeholder="Add a more detailed description..."
            />
            <card-activity />
            <div class="actions flex f-col f-center">
                <button @click="onAddMembers">Members</button>
                <button>Labels</button>
                <button>Checklist</button>
                <button>
                    <label class="upload-btn" for="uploader">
                        Attachment
                    </label>
                </button>
                <input
                    class="upload"
                    type="file"
                    name="uploader"
                    id="uploader"
                    @change="onUpload"
                />
                <div>
                    <button @click="setDate">Set Date</button>
                    <button @click="removeDate" v-if="card.dueDate">
                        Remove Date
                    </button>
                </div>
                <button class="cover-btn" @click="setCover">Cover</button>
                <button>Copy</button>
                <button class="dlt-btn" @click="deleteCard">Delete Card</button>
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
                <date-picker
                    :dueDate="card.dueDate"
                    v-if="dueDate"
                    @setDate="setNewDate"
                />
                <add-members
                    v-if="isAddMembers"
                    :cardMembers="cardMembers()"
                    :boardMembers="boardMembers"
                    @closeMembers="closeMembers"
                    @updateMembers="updateMembers"
                />
                <card-cover
                    v-if="cover"
                    :color="card.style.headerColor"
                    @colorChange="updateCover"
                />
            </div>
            <card-attachments
                :attachments="attachments"
                @updateAttachments="updateAttachments"
            />
        </div>
    </section>
</template>

<script>
import avatar from 'vue-avatar';
import cardActivity from '@/cmps/card/card-activity.cmp';
import cardAttachments from '@/cmps/card/card-attachments.cmp';
import cardMove from '@/cmps/card/card-move.cmp';
import cardCover from '@/cmps/card/card-cover.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-labels.cmp';
import { utilService } from '@/services/util.service';
import { uploadImg } from '@/services/img-upload.service';
import addMembers from '@/cmps/custom-elements/add-members.cmp'

export default {
    data() {
        return {
            card: null,
            isPopUp: false,
            currPopUp: null,
            isLoading: false
        }
    },
    computed: {
        localTime() {
            return (new Date(this.card.dueDate)).toLocaleDateString();
        },
        boardMembers() {
            if (!this.board.isPrivate) return utilService.deepCopy(this.$store.getters.users);
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
        cover() {
            return this.currPopUp === 'cover';
        },
        headerStyle() {
            return { background: this.card.style.headerColor }
        },
        attachments() {
            return this.card.attachments
        },
        isAddMembers() {
            return this.currPopUp === 'member';
        }
    },
    methods: {
        updateBoard() {
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board });
        },
        updateAttachments(attachments) {
            this.card.attachments = attachments;
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, this.card);
            })
            this.$store.dispatch({ type: 'updateBoard', board });

        },
        emitClose() {
            this.$emit('close');
        },
        deleteCard() {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1);
            })
            this.$store.dispatch({ type: 'updateBoard', board });
            this.emitClose();
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
        removeDate() {
			delete this.card.dueDate;
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(card => card.id === this.card.id)
                if (cardIdx !== -1) {
                    group.cards.splice(cardIdx, 1, this.card)
                }
            })
			this.$store.dispatch({ type: 'updateBoard', board: board });
        },
        setNewDate(dueDate) {
			const updatedCard = utilService.deepCopy(this.card)
			if (this.card.dueDate) {
				delete this.card.dueDate;
			}
			updatedCard.dueDate = dueDate
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(card => card.id === updatedCard.id)
                if (cardIdx !== -1) {
                    group.cards.splice(cardIdx, 1, updatedCard)
                }
            })
			this.$store.dispatch({ type: 'updateBoard', board: board });
			this.card = updatedCard;
            this.isPopUp = false;

        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board });
            this.isPopUp = false;
        },
        async onUpload(ev) {
            this.isLoading = true;
            const res = await uploadImg(ev);
            console.log('uploaded', res)
            const attachment = {
                id: utilService.makeId(),
                name: res.original_filename,
                format: res.format,
                src: res.url
            }
            if (!this.card.attachments) this.card.attachments = []
            const updatedCard = utilService.deepCopy(this.card)
            updatedCard.attachments.push(attachment)
            console.log(this.card, 'after adding')
            this.isLoading = false;
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === updatedCard.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, updatedCard);
            })
            this.$store.dispatch({ type: 'updateBoard', board });
            this.card = updatedCard;
        },
        setCover() {
            this.currPopUp = 'cover';
            this.isPopUp = true;
        },
        updateCover(color) {
            this.card.style.headerColor = color;
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board })
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
            const card = this.card;
            const memberIdx = card.members.findIndex(member => member._id === userId);
            if (memberIdx === -1) {
                const newUser = this.$store.getters.users.find(user => user._id === userId);
                console.log(newUser);
                const newMember = {
                    _id: newUser._id,
                    username: newUser.username,
                    imgUrl: newUser.imgUrl
                };
                card.members.push(newMember);
            } else {
                card.members.splice(memberIdx, 1);
            }
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            });
            this.$store.dispatch({ type: 'updateBoard', board });
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
        this.card = this.$store.getters.currCard;
        this.$store.dispatch('loadUsers')
    },
    destroyed() {
        this.$store.commit({ type: 'updateCurrCard', card: null })
        this.card = null;
    },
    components: {
        cardActivity,
        cardMove,
        datePicker,
        addMembers,
        cardAttachments,
        cardCover,
        cardLabels,
        avatar
    }
}
</script>
