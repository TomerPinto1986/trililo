<template>
    <section
        v-if="card"
        class="card-details flex f-col"
        @click.stop="closePopup"
    >
        <div class="card-header flex" :style="headerStyle">
            <button class="cancel-btn" @click.stop="emitClose">
                <i class="el-icon-close"></i>
            </button>
        </div>
        <div class="card-main-container flex">
            <div class="card-info">
                <div class="info">
                    <span class="card-icon">
                        <i class="el-icon-postcard"></i>
                    </span>
                    <input
                        class="title"
                        type="text"
                        v-model="card.title"
                        @blur="updateBoard"
                    />
                    <h4 class="in-list">
                        in list <span>{{ getCurrGroup.title }}</span>
                    </h4>
                </div>
                <section class="add-to-card flex wrap">
                    <div
                        class="card-members f-col"
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
                                    :size="32"
                                    :username="'+'"
                                    background-color="#E2E4E9"
                                    color="rgb(94, 108, 132)"
                                ></avatar>
                            </span>
                        </div>
                    </div>
                    <div class="label-marks f-col" v-if="labelsSelected.length">
                        <h3 class="flex">Labels</h3>
                        <div class="label-container flex wrap">
                            <div
                                v-for="label in labelsSelected"
                                :key="label.id"
                                class="label flex f-center"
                                :style="{ backgroundColor: label.color }"
                            >
                                {{
                                    label.title
                                }}
                            </div>
                            <button
                                class="label plus-btn flex f-center"
                                @click.stop="openLabels"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div class="due-date" v-if="card.dueDate || dueDate">
                        <h3 @click.stop="setDate">Due Date</h3>
                        <span class="due-date-info" v-if="card.dueDate">
                            <check-box
                                class="due-date-checkbox"
                                :isDone="card.isDone"
                            ></check-box
                            ><span class="due-date-local-time">{{
                                localTime
                            }}</span>
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
                <div class="description flex">
                    <i class="fas fa-align-left"></i>
                    <h2>Description</h2>
                    <button>Edit</button>
                </div>
                <!-- Turn to prop -->
                <textarea
                    resize="none"
                    cols="50"
                    rows="3"
                    class="desc"
                    type="text"
                    v-model="card.description"
                    placeholder="Add a more detailed description..."
                />
                <div v-if="card.checklistGroup" class="checklist-group">
                    <i class="fal fa-tasks"></i>
                    <card-checklist
                        v-for="checklist in card.checklistGroup"
                        :key="checklist.id"
                        :checklist="checklist"
                        @updeteChecklist="updeteChecklist"
                        @deleteChecklist="deleteChecklist"
                    />
                </div>
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
                    <add-checklist
                        v-if="checklist"
                        :card="card"
                        @updateCard="updateCard"
                        @close="closePopup"
                    />
                </pop-up>
                <card-attachments
                    :attachments="attachments"
                    @updateAttachments="updateAttachments"
                />
                <card-activity
                    v-if="card"
                    :user="loggedinUser"
                    :card="card"
                    :activities="cardActivities"
                    :isShowDetails="false"
                    @addActivity="addActivity"
                />
            </div>
            <div class="actions flex f-col">
                <h3>Add to card</h3>
                <button @click.stop="onAddMembers">
                    <i class="el-icon-user"></i>Members
                </button>
                <button @click.stop="openLabels">
                    <i class="el-icon-collection-tag"></i>Labels
                </button>
                <button @click.stop="addChecklist">
                    <i class="el-icon-document-checked"></i>Checklist
                </button>
                <button>
                    <label class="upload-btn" for="uploader">
                        <i class="fal fa-paperclip"></i>
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
                <button class="cover-btn" @click.stop="openCoverPicker">
                    <i class="fal fa-window-maximize"></i>
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
                <div>
                    <button @click.stop="setDate">
                        <i class="fal fa-clock"></i>Set Date
                    </button>
                    <button @click.stop="removeDate" v-if="card.dueDate">
                        <i class="fal fa-history"></i>
                        Remove Date
                    </button>
                </div>
                <button @click="cloneCard">
                    <i class="fal fa-clone"></i>Clone
                </button>
                <button class="dlt-btn" @click.stop="deleteCard">
                    <i class="fal fa-trash-alt"></i>
                    Delete Card
                </button>
                <button class="move-btn" @click.stop="emitMove">
                    <i class="fal fa-arrow-right"></i>Move
                </button>
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
import addChecklist from '../cmps/card/add-checklist.cmp';
import cardChecklist from '../cmps/card/card-checklist.cmp';
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
        loggedinUser() {
            return this.$store.getters.loggedinUser;
        },
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
        checklist() {
            return this.currPopUp === 'checklist';
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
        },
        cardActivities() {
            return this.board.activities.filter(activity => {
                if (activity.card) {
                    if (activity.card.id === this.card.id) return activity
                }
            })
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            return this.board.labels.filter(label => selectIds.includes(label.id));
        },
    },
    methods: {
        updateBoard() {
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board });
        },
        updateAttachments(attachments) {
            const card = utilService.deepCopy(this.card)
            card.attachments = attachments;
            this.updateCard(card);
        },
        emitClose() {
            this.$emit('close');
        },
        deleteCard() {
            const board = this.board;
            let cardTitle;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
                if (cardIdx !== -1) {
                    cardTitle = group.cards[cardIdx].title;
                    group.cards.splice(cardIdx, 1);
                }
            })
            this.$store.dispatch({ type: 'updateBoard', board });
            this.emitClose();
            this.addActivity(`deleted the card '${cardTitle}'`);

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
            card.dueDate = null;
            this.updateCard(card);
            this.card = card;
            this.addActivity(`removed the due date from the card '${card.title}'`, card);

        },
        setNewDate(dueDate) {
            const updatedCard = utilService.deepCopy(this.card)
            if (this.card.dueDate) {
                delete this.card.dueDate;
            }
            updatedCard.dueDate = dueDate
            this.updateCard(updatedCard);
            this.card = updatedCard;
            this.closePopup();
            this.addActivity(`added due date to the card '${updatedCard.title}'`, updatedCard);


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
        addChecklist() {
            this.currPopUp = 'checklist';
            this.isPopUp = true;
        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.$store.dispatch({ type: 'updateBoard', board });
            this.isPopUp = false;
            if (status.startGroup !== status.endGroup) {
                const groupTitle = board.groups.find(group => group.id === status.endGroup).title;
                this.addActivity(`moved card '${this.card.title}' to '${groupTitle}'`, this.card);
            }
        },
        async onUpload(ev) {
            this.isLoading = true;
            const res = await uploadImg(ev);
            const attachment = {
                id: utilService.makeId(),
                name: res.original_filename,
                format: res.format,
                src: res.url
            }
            if (!this.card.attachments) this.card.attachments = []
            const updatedCard = utilService.deepCopy(this.card)
            updatedCard.attachments.push(attachment)
            this.isLoading = false;
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
            const card = this.card;
            const memberIdx = card.members.findIndex(member => member._id === userId);
            const newUser = this.$store.getters.users.find(user => user._id === userId);
            if (memberIdx === -1) {
                const newMember = {
                    _id: newUser._id,
                    username: newUser.username,
                    imgUrl: newUser.imgUrl
                };
                card.members.push(newMember);
            } else {
                card.members.splice(memberIdx, 1);
            }
            this.updateCard(card);
            const action = (memberIdx === -1) ? 'added' : 'removed';
            this.addActivity(`${action} ${newUser.username} to a card`, card, null, this.loggedinUser)
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
        cloneCard() {
            const cardCopy = utilService.deepCopy(this.card);
            cardCopy.id = utilService.makeId();
            const board = this.board;
            const groupIdx = board.groups.findIndex(group => group.cards.some(card => card.id === this.card.id));
            if (groupIdx === -1) return;
            board.groups[groupIdx].cards.push(cardCopy);
            this.$store.dispatch({ type: 'updateBoard', board });
        },
        addActivity(txt, card, comment = null, user = this.loggedinUser) {
            this.$store.commit('setEmptyActivity');
            const activity = utilService.deepCopy(this.$store.getters.emptyActivity);
            activity.txt = txt;
            activity.comment = comment;
            activity.byMember = utilService.deepCopy(user);
            activity.createdAt = Date.now();
            if (card) {
                const url = (this.$route.params.cardId) ? '' : `/card/${card.id}`;
                console.log(card)
                activity.card = {
                    id: card.id,
                    title: card.title,
                    url
                }
            }
            const board = this.board;
            board.activities.unshift(activity);
            this.updateBoard(board);
        },
        updeteChecklist(checklist) {
            const card = this.card;
            const idx = card.checklistGroup.findIndex(currChecklist => currChecklist.id === checklist.id);
            if (idx !== -1) card.checklistGroup.splice(idx, 1, checklist);
            this.updateCard(card);
        },
        deleteChecklist(checklistId) {
            const card = this.card;
            const idx = card.checklistGroup.findIndex(currChecklist => currChecklist.id === checklistId);
            if (idx !== -1) card.checklistGroup.splice(idx, 1);
            this.updateCard(card);
        },
        updateCard(card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.$store.dispatch({ type: 'updateBoard', board });
            this.card = card;
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
        checkBox,
        addChecklist,
        cardChecklist
    }
}
</script>
