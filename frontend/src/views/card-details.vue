<template>
    <section
        v-if="card"
        class="card-details flex f-col"
        @click.stop="closePopup"
    >
        <div
            class="card-header"
            :style="headerStyle"
            v-if="card.style.headerColor"
        ></div>
        <button
            class="cancel-btn flex f-center"
            @click.stop="emitClose"
            :class="{ cover: this.card.style.headerColor }"
        >
            <i class="el-icon-close"></i>
        </button>
        <div
            class="card-main-container"
            :class="{ cover: this.card.style.headerColor }"
        >
            <!-- INFO -->
            <div class="card-info">
                <div class="info">
                    <span class="card-icon">
                        <img src="@/assets/svg/card.svg" />
                    </span>
                    <input
                        ref="card-title"
                        class="title"
                        type="text"
                        v-model="card.title"
                        @blur="updateCardTitle"
                        @keyup.enter="updateCardTitle"
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
                                <custom-avatar
                                    class="avatar"
                                    :size="34"
                                    :username="member.username"
                                    :src="member.imgUrl"
                                />
                            </span>
                            <button
                                class="plus-btn member flex f-center"
                                @click.stop="onAddMembers"
                            >
                                +
                            </button>
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
                                {{ label.title }}
                            </div>
                            <button
                                class="plus-btn flex f-center"
                                @click.stop="openLabels"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div class="due-date" v-if="card.dueDate || dueDate">
                        <h3 @click.stop="setDate">Due Date</h3>
                        <span class="due-date-info" v-if="card.dueDate">
                            <el-checkbox
                                class="checkbox"
                                v-model="card.isComplete"
                                @change="toggleIsComplete"
                            ></el-checkbox>
                            <span class="due-date-local-time">{{
                                moment(card.dueDate).format("MMM Do")
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
                    <span class="card-icon">
                        <img src="@/assets/svg/desc.svg" />
                    </span>

                    <card-description
                        :description="card.description"
                        @updateDesc="updateDesc"
                    />
                </div>
                <!-- <img
					v-if="isLoading"
					class="loading-gif"
					src="../assets/animations/load.gif"
					alt="Loading"
				/> -->
                <div class="attachments-group flex">
                    <span class="card-icon">
                        <img src="@/assets/svg/attach.svg" />
                    </span>

                    <div class="attachments-content">
                        <h2>Attachments</h2>
                        <card-attachments
                            :attachments="attachments"
                            :isLoading="isLoading"
                            @updateAttachments="updateAttachments"
                        />
                    </div>
                </div>
                <div v-if="card.checklistGroup" class="checklist-group">
                    <div
                        class="checklist flex"
                        v-for="checklist in card.checklistGroup"
                        :key="checklist.id"
                    >
                        <span class="card-icon">
                            <img src="@/assets/svg/checklist.svg" />
                        </span>

                        <card-checklist
                            :checklist="checklist"
                            @updeteChecklist="updeteChecklist"
                            @deleteChecklist="deleteChecklist"
                        />
                    </div>
                </div>
                <div class="activity flex">
                    <span class="card-icon">
                        <img src="@/assets/svg/activities.svg" />
                    </span>

                    <card-activity
                        v-if="card"
                        :user="loggedinUser"
                        :card="card"
                        :activities="cardActivities"
                        :isShowDetails="false"
                        @addActivity="addActivity"
                    />
                </div>
            </div>
            <!-- ACTIONS -->
            <div class="actions flex f-col">
                <h3 class="add-to-card-title">Add to card</h3>
                <button
                    @click.stop="onAddMembers"
                    class="flex f-a-center content-after action-btn"
                    title="Members"
                    data-txt="Members"
                >
                    <img
                        class="icon-btn"
                        src="@/assets/svg/member.svg"
                        alt=""
                    />
                    <pop-up v-if="isCmpOpen('member')" @closePopup="closePopup"
                        ><add-members
                            :cardMembers="cardMembers()"
                            :boardMembers="boardMembers"
                            @updateMembers="updateMembers"
                        />
                    </pop-up>
                </button>
                <button
                    @click.stop="openLabels"
                    class="flex f-a-center content-after action-btn"
                    title="Labels"
                    data-txt="Labels"
                >
                    <img class="icon-btn" src="@/assets/svg/label.svg" />
                    <pop-up
                        v-if="board && isCmpOpen('labels')"
                        @closePopup="closePopup"
                    >
                        <card-labels
                            :card="card"
                            :boardLabels="board.labels"
                            @updateCard="updateCard"
                            @updateLabelTitle="updateLabelTitle"
                        />
                    </pop-up>
                </button>
                <button
                    @click.stop="addChecklist"
                    class="flex f-a-center content-after action-btn"
                    title="Checklist"
                    data-txt="Checklist"
                >
                    <img
                        class="icon-btn"
                        src="@/assets/svg/checklist.svg"
                        alt=""
                    />
                    <pop-up
                        v-if="isCmpOpen('checklist')"
                        @closePopup="closePopup"
                    >
                        <add-checklist
                            :card="card"
                            @updateCard="updateCard"
                            @close="closePopup"
                        />
                    </pop-up>
                </button>
                <button
                    @click="startUpload"
                    class="upload-btn flex f-a-center content-after action-btn"
                    data-txt="Attachments"
                >
                    <img class="icon-btn" src="@/assets/svg/attach.svg" />
                </button>
                <input
                    ref="upload"
                    class="upload"
                    type="file"
                    name="uploader"
                    id="uploader"
                    @change="onUpload"
                />
                <button
                    class="cover-btn flex f-a-center content-after action-btn"
                    title="Cover"
                    data-txt="Cover"
                    @click.stop="openCoverPicker"
                >
                    <img class="icon-btn" src="@/assets/svg/cover.svg" />
                    <el-color-picker
                        popper-class="color-dropdown"
                        ref="color-picker"
                        class="color-picker"
                        size="mini"
                        v-model="card.style.headerColor"
                        @change="updateCover"
                    ></el-color-picker>
                    <pop-up v-if="isCmpOpen('cover')" @closePopup="closePopup">
                        <card-cover
                            :color="card.style.headerColor"
                            @colorChange="updateCover"
                    /></pop-up>
                </button>
                <button
                    @click.stop="setDate"
                    class="flex f-a-center content-after action-btn"
                    title="Set Date"
                    data-txt="Set Date"
                >
                    <img class="icon-btn" src="@/assets/svg/clock.svg" />
                </button>
                <button
                    @click.stop="removeDate"
                    v-if="card.dueDate"
                    class="remove-date flex f-a-center content-after action-btn"
                    title="Remove Date"
                    data-txt="Remove Date"
                >
                    <i class="fal fa-history"></i>
                </button>
                <h3 class="actions-title">Actions</h3>
                <button
                    @click="cloneCard"
                    class="flex f-a-center content-after action-btn"
                    title="Clone"
                    data-txt="Clone"
                >
                    <!-- <img
                        class="icon-btn clone-img"
                        src="@/assets/svg/copy.svg"
                    /> -->
                    <i class="fal fa-clone"></i>
                </button>
                <button
                    class="dlt-btn flex f-a-center content-after action-btn"
                    title="Delete"
                    data-txt="Delete Card"
                    @click.stop="deleteCard"
                >
                    <i class="fal fa-trash-alt"></i>
                </button>
                <button
                    class="move-btn flex f-a-center content-after action-btn"
                    title="Move"
                    data-txt="Move"
                    @click.stop="emitMove"
                >
                    <img class="icon-btn" src="@/assets/svg/move.svg" />
                    <pop-up v-if="isCmpOpen('move')" @closePopup="closePopup">
                        <card-move
                            :groups="board.groups"
                            :group="getCurrGroup"
                            :currPosition="getCurrPosition"
                            @moveCard="moveCard"
                    /></pop-up>
                </button>
            </div>
        </div>
    </section>
</template>

<script>
import { utilService } from '@/services/util.service';
import { uploadImg } from '@/services/img-upload.service';
import { socketService } from '@/services/socket.service'
// import checkBox from '../cmps/custom-elements/check-box.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import addMembers from '@/cmps/custom-elements/add-members.cmp';
import popUp from '../cmps/card/card-details/pop-up.cmp';
import cardActivity from '@/cmps/card/card-details/card-activity.cmp';
import cardAttachments from '@/cmps/card/card-details/card-attachments.cmp';
import cardMove from '@/cmps/card/card-details/card-move.cmp';
import cardCover from '@/cmps/card/card-details/card-cover.cmp';
import cardLabels from '@/cmps/card/card-details/card-labels.cmp';
import addChecklist from '../cmps/card/card-details/add-checklist.cmp';
import cardChecklist from '../cmps/card/card-details/card-checklist.cmp';
import cardDescription from '../cmps/card/card-details/card-description.cmp';

export default {
    data() {
        return {
            card: null,
            isPopUp: false,
            currPopUp: null,
            isLoading: false,
        }
    },
    computed: {
        loggedinUser() {
            return this.$store.getters.loggedinUser;
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
        getCurrPosition() { //get rid of get
            return this.getCurrGroup.cards.findIndex(card => card.id === this.card.id) + 1;
        },
        dueDate() {
            return this.currPopUp === 'duedate';
        },
        isCmpOpen() {
            return (cmpName) => this.currPopUp === cmpName;
        },
        headerStyle() {
            return { background: this.card.style.headerColor };
        },
        attachments() {
            return this.card.attachments;
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
        updateCardTitle() {
            this.$refs['card-title'].blur();
            this.updateBoard();
        },
        updateBoard(board = this.board, isSocket = false) {
            this.$store.dispatch({ type: 'updateBoard', board });
            if (!isSocket) {
                socketService.emit('updateCard', this.card)
                socketService.emit('updateBoard', board)
            }
        },
        updateCard(card = this.card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.updateBoard(board);
            this.card = card;
        },
        updateCardSocket(card) {
            const board = this.board;
            board.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            })
            this.updateBoard(board, true);
            this.card = card;
        },
        addActivity(txt, card, comment = null, user = this.loggedinUser) {
            console.log(txt,card,comment,user)
            this.$store.commit('setEmptyActivity');
            const activity = utilService.deepCopy(this.$store.getters.emptyActivity);
            activity.txt = txt;
            activity.comment = comment;
            activity.byMember = utilService.deepCopy(user);
            activity.createdAt = Date.now();
            if (card) {
                activity.card = {
                    id: card.id,
                    title: card.title,
                }
            }
            const board = this.board;
            board.activities.unshift(activity);
            this.updateBoard(board);
        },
        closePopup() {
            this.isPopUp = false;
            this.currPopUp = '';
        },
        emitClose() {
            this.$emit('close');
        },
        cloneCard() {
            const cardCopy = utilService.deepCopy(this.card);
            cardCopy.id = utilService.makeId();
            const board = this.board;
            const groupIdx = board.groups.findIndex(group => group.cards.some(card => card.id === this.card.id));
            if (groupIdx === -1) return;
            board.groups[groupIdx].cards.push(cardCopy);
            this.updateBoard(board);
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
            this.updateBoard(board);
            this.emitClose();
            this.addActivity(`deleted the card '${cardTitle}'`);
        },
        moveCard(status) {
            this.$store.commit({ type: 'updateCardStatus', status });
            const board = this.board;
            this.updateBoard(board);
            this.isPopUp = false;
            if (status.startGroup !== status.endGroup) {
                // const groupTitle = board.groups.find(group => group.id === status.endGroup).title;
                // this.addActivity(`moved card '${this.card.title}' to '${groupTitle}'`, this.card);
            }
        },
        startUpload() {
            this.$refs['upload'].click();
        },
        updateAttachments(attachments) {
            const card = utilService.deepCopy(this.card)
            card.attachments = attachments;
            this.updateCard(card);
        },
        async onUpload(ev) {
            this.isLoading = true;
            const res = await uploadImg(ev);
            const imgRatio = res.width / res.height;
            const imgClass = {
                regular: imgRatio > 0.9 && imgRatio < 1.1,
                portrait: imgRatio <= 0.9,
                landscape: imgRatio >= 1.1
            };
            const attachment = {
                id: utilService.makeId(),
                name: res.original_filename,
                format: res.format,
                src: res.url,
                imgClass
            }
            if (!this.card.attachments) this.card.attachments = []
            const updatedCard = utilService.deepCopy(this.card)
            updatedCard.attachments.push(attachment)
            this.isLoading = false;
            this.updateCard(updatedCard)
            this.card = updatedCard;
        },
        updateDesc(newDesc) {
            let card = this.card;
            card.description = newDesc;
            this.updateCard(card);
        },
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
            this.addActivity(`removed the due date from `, card);
        },
        setNewDate(dueDate) {
            this.card.isDone = false;
            const updatedCard = utilService.deepCopy(this.card)
            if (this.card.dueDate) {
                delete this.card.dueDate;
            }
            updatedCard.dueDate = dueDate
            this.updateCard(updatedCard);
            this.card = updatedCard;
            this.closePopup();
            this.addActivity(`added due date to `, updatedCard);
        },
        openLabels() {
            this.currPopUp = 'labels';
            this.isPopUp = true;
        },
        updateLabelTitle(labelId, title) {
            const board = this.board;
            const idx = board.labels.findIndex(label => label.id === labelId);
            if (idx !== -1) board.labels[idx].title = title;
            this.updateBoard(board);
        },
        addChecklist() {
            this.currPopUp = 'checklist';
            this.isPopUp = true;
        },
        openCoverPicker() {
            this.$refs['color-picker']._data.showPicker = true;
        },
        updateCover(color) {
            this.card.style.headerColor = color;
            const board = this.board;
            this.updateBoard(board);
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
            const action = (memberIdx === -1) ? `added ${newUser.username} to ` : `removed ${newUser.username} from`;
            this.addActivity(action, card, null, this.loggedinUser)
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            return this.card.members
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
        toggleIsComplete(){
            const card = this.card;
            card.isDone = !card.isDone;
            this.updateCard(card);
        }
    },
    created() {
        socketService.on('cardUpdate', this.updateCardSocket)
        const cardId = this.$route.params.cardId
        this.$store.commit({ type: 'setCurrCard', cardId })
        this.card = this.$store.getters.currCard;
        this.$store.dispatch('loadUsers')

    },
    destroyed() {
        socketService.off('cardUpdate', this.updateCardSocket)
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
        customAvatar,
        popUp,
        // checkBox,
        addChecklist,
        cardChecklist,
        cardDescription
    }
}
</script>
