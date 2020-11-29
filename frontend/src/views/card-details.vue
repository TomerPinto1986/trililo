<template>
    <section
        v-if="card"
        class="card-details flex f-col"
        @click.stop="closePopup"
    >
        <div class="card-header flex" :style="headerStyle">
            <button class="cancel-btn" @click.stop="emitClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="card-main-container flex">
            <div class="card-info">
                <input
                    class="title"
                    type="text"
                    v-model="card.title"
                    @blur="updateBoard"
                />
                <section class="add-to-card flex">
                    <div
                        class="f-col card-members"
                        v-if="card.members && card.members.length"
                    >
                        <h3>Members</h3>
                        <div class="flex">
                            <span
                                v-for="member in card.members"
                                :key="member._id"
                            >
                                <avatar :size="32" :username="member.username">
                                </avatar>
                            </span>
                            <span @click.stop="onAddMembers">
                                <avatar
                                    class="add-member"
                                    :size="35"
                                    :username="'+'"
                                    background-color="#E2E4E9"
                                    color="rgb(94, 108, 132)"
                                ></avatar>
                            </span>
                        </div>
                    </div>
                    <ul v-if="labelsSelected().length" class="label-marks flex">
                        <h3>Labels</h3>
                        <div>
                            <li
                                v-for="label in labelsSelected()"
                                :key="label.id"
                            >
                                <div
                                    class="flex f-center"
                                    :style="{ backgroundColor: label.color }"
                                >
                                    <span>{{ label.title }}</span>
                                </div>
                            </li>
                        </div>
                    </ul>

                    <div class="due-date" v-if="card.dueDate || dueDate">
                        <h3 @click.stop="setDate">Due Date</h3>
                        <span v-if="card.dueDate">
                            <check-box :isDone="card.isDone"></check-box
                            >{{ localTime }}
                        </span>
                        <date-picker
                            ref="date-picker"
                            class="date-picker"
                            slot="date-picker"
                            :dueDate="card.dueDate"
                            v-if="dueDate"
                            @setDate="setNewDate"
                        />
                    </div>
                </section>
                <h2>Description</h2>

                <!-- Turn to prop -->
                <textarea
                    cols="50"
                    rows="5"
                    class="desc"
                    type="text"
                    v-model="card.description"
                    placeholder="Add a more detailed description..."
                />
                <card-activity :activities="card.activities" />
                <div class="btns flex"></div>
                <pop-up v-if="isPopUp" @closePopup="closePopup">
                    <card-move
                        v-if="move"
                        :groups="board.groups"
                        :group="getCurrGroup"
                        :currPosition="getCurrPosition"
                        @moveCard="moveCard"
                    />
                    <add-members
                        v-if="isAddMembers"
                        :cardMembers="cardMembers()"
                        :boardMembers="boardMembers"
                        @updateMembers="updateMembers"
                    />
                    <template v-if="board">
                        <card-labels
                            v-if="labels"
                            :card="card"
                            :boardLabels="board.labels"
                            @updateCard="updateCard"
                            @updateLabelTitle="updateLabelTitle"
                        />
                    </template>
                    <card-cover
                        v-if="cover"
                        :color="card.style.headerColor"
                        @colorChange="updateCover"
                    />
                </pop-up>
                <card-attachments
                    :attachments="attachments"
                    @updateAttachments="updateAttachments"
                />
            </div>
            <div class="actions flex f-col">
                <h3>Add to card</h3>
                <button @click.stop="onAddMembers">Members</button>
                <button @click.stop="openLabels">Labels</button>
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
                    <button @click.stop="setDate">Set Date</button>
                    <button @click.stop="removeDate" v-if="card.dueDate">
                        Remove Date
                    </button>
                </div>
                <button class="cover-btn" @click.stop="openCoverPicker">
                    Cover
                    <el-color-picker
                        popper-class="color-dropdown"
                        ref="color-picker"
                        class="color-picker"
                        size="mini"
                        v-model="card.style.headerColor"
                        @change="updateCover"
                    ></el-color-picker>
                </button>
                <button>Copy</button>
                <button class="dlt-btn" @click.stop="deleteCard">
                    Delete Card
                </button>
                <button class="move-btn" @click.stop="emitMove">Move</button>
            </div>
        </div>
    </section>
</template>

<script>
import checkBox from '../cmps/custom-elements/check-box.cmp';
import popUp from '../cmps/card/pop-up.cmp';
import avatar from 'vue-avatar';
import cardActivity from '@/cmps/card/card-activity.cmp';
import cardAttachments from '@/cmps/card/card-attachments.cmp';
import cardMove from '@/cmps/card/card-move.cmp';
import cardCover from '@/cmps/card/card-cover.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-labels.cmp';
import { utilService } from '@/services/util.service';
import { uploadImg } from '@/services/img-upload.service';
import addMembers from '@/cmps/custom-elements/add-members.cmp';

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
            return utilService.deepCopy(this.$store.getters.currBoard);
        },
        getCurrGroup() {
            const group = this.board.groups.find(group => group.cards.some(card => card.id === this.card.id));
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
        labels() {
            return this.currPopUp === 'labels';
        },
        cover() {
            return this.currPopUp === 'cover';
        },
        headerStyle() {
            return { background: this.card.style.headerColor };
        },
        attachments() {
            return this.card.attachments;
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
            const card = utilService.deepCopy(this.card)
            card.attachments = attachments;
            // const board = this.board;
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
            // 	if (cardIdx !== -1) group.cards.splice(cardIdx, 1, this.card);
            // })
            // this.$store.dispatch({ type: 'updateBoard', board });
            this.updateCard(card);
        },
        emitClose() {
            this.$emit('close');
        },
        deleteCard() {
            // const board = this.board;
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
            // 	if (cardIdx !== -1) group.cards.splice(cardIdx, 1);
            // })
            // this.$store.dispatch({ type: 'updateBoard', board });
            this.updateCard(null);
            this.emitClose();
        },
        // for later on when we will make a pop up cmp
        emitMove() {
            this.currPopUp = 'move';
            this.isPopUp = true;
        },
        setDate() {
            this.currPopUp = 'duedate';
        },
        removeDate() {
            const card = utilService.deepCopy(this.card)
            // delete card.dueDate;
            card.dueDate = null;
            // const board = this.board;
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(card => card.id === this.card.id)
            // 	if (cardIdx !== -1) {
            // 		group.cards.splice(cardIdx, 1, this.card)
            // 	}
            // })
            // this.$store.dispatch({ type: 'updateBoard', board: board });
            this.updateCard(card);
            this.card = card;

        },
        setNewDate(dueDate) {
            const updatedCard = utilService.deepCopy(this.card)
            if (this.card.dueDate) {
                delete this.card.dueDate;
            }
            updatedCard.dueDate = dueDate
            // const board = this.board;
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(card => card.id === updatedCard.id)
            // 	if (cardIdx !== -1) {
            // 		group.cards.splice(cardIdx, 1, updatedCard);
            // 	}
            // })
            // this.$store.dispatch({ type: 'updateBoard', board: board });
            this.updateCard(updatedCard);
            this.card = updatedCard;
            this.closePopup();

        },
        openLabels() {
            this.currPopUp = 'labels';
            this.isPopUp = true;
        },
        updateLabelTitle(labelId, title) {
            const board = this.board;
            const idx = board.labels.findIndex(label => label.id === labelId);
            if (idx !== -1) board.labels[idx].title = title;
            this.$store.dispatch({ type: 'updateBoard', board });
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            return this.board.labels.filter(label => selectIds.includes(label.id));
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
            // const board = this.board;
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(currCard => currCard.id === updatedCard.id);
            // 	if (cardIdx !== -1) group.cards.splice(cardIdx, 1, updatedCard);
            // })
            // this.$store.dispatch({ type: 'updateBoard', board });
            this.updateCard(updatedCard)
            this.card = updatedCard;
        },
        openCoverPicker() {
            this.$refs['color-picker']._data.showPicker = true;
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
        updateMembers(userId) {
            // const board = this.board;
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
            // board.groups.forEach(group => {
            // 	const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
            // 	if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            // });
            // this.$store.dispatch({ type: 'updateBoard', board });
            this.updateCard(card);
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            return this.card.members
        },
        closePopup() {
            this.isPopUp = false;
            this.currPopUp = '';
        },
        updateCard(card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.$store.dispatch({ type: 'updateBoard', board });
        }
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
        avatar,
        popUp,
        checkBox
    }
}
</script>
