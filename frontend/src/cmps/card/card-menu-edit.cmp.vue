<template>
    <section class="card-menu-edit flex">
        <div class="flex f-col">
        <div class="title-edit mini-preview icons flex wrap">
            <ul v-if="labelsSelected.length" class="label-marks flex wrap">
				<li class="flex" v-for="label in labelsSelected" :key="label">
					<div
						class="label"
						:style="{ backgroundColor: label }"
					></div>
				</li>
			</ul>
            <textarea
                @keydown.enter.prevent
                @keyup.enter="saveCard"
                ref="card-title"
                class="title-edit-menu-bar"
                placeholder="Enter a title for this card…"
                maxlength="120"
                v-model="cardTxt"
            ></textarea>
            <div class="icons flex wrap">
			<span class="small-icons">
				<i v-if="card.dueDate" :style="dueDateStyle" class="far fa-clock">
					<span> {{ moment(card.dueDate).format("MMM Do") }}</span>
				</i>

				<i v-if="card.description" class="description-icon"
					><img src="@/assets/svg/desc.svg"
				/></i>
				<i v-if="card.checklist" class="fas fa-list"></i>
				<i
					v-if="card.attachments && card.attachments.length"
					class="fas fa-paperclip"
				></i>
				<i v-if="commentsLen" class="fal fa-comment">{{
					commentsLen
				}}</i>
			</span>
			<span
				class="members-container flex"
				v-if="card.members && card.members.length"
			>
				<div
					class="card-members"
					v-for="member in card.members"
					:key="member._id"
				>
					<custom-avatar
						:size="30"
						:username="member.username"
						:src="member.imgUrl"
					/>
				</div>
			</span>
		</div>
        </div>
            <div class="add-card-btns flex">
                <button @click="saveTitle" class="edit-title-btn">Save</button>
            </div>
        </div>
        <div class="edit-card-actions flex f-col">
            <button class="action-btn" @click="editLabel">
                Edit Labels
                <pop-up
                    class="edit-card"
                    v-if="board && isCmpOpen('labels')"
                    @closePopup="closePopup"
                >
                    <card-labels
                        :card="card"
                        :boardLabels="board.labels"
                        @updateCard="updateCardLabel"
                        @updateLabelTitle="updateLabelTitle"
                    />
                </pop-up>
            </button>
            <button class="action-btn" @click="changeMembers">
                Change Members
                <pop-up
                    class="edit-card"
                    v-if="isCmpOpen('member')"
                    @closePopup="closePopup"
                    ><add-members
                        :cardMembers="cardMembers()"
                        :boardMembers="boardMembers"
                        @updateMembers="updateMembers"
                    />
                </pop-up>
            </button>
            <button class="action-btn" @click="move">Move</button>
            <pop-up v-if="isCmpOpen('move')" @closePopup="closePopup">
                <card-move
                    class="edit-card"
                    :isClone="false"
                    :groups="board.groups"
                    :group="currGroup"
                    :currPosition="currPosition"
                    @moveCard="moveCard"
            /></pop-up>
            <button class="action-btn" @click="copy">Copy</button>
            <pop-up v-if="isCmpOpen('clone')" @closePopup="closePopup">
                <card-move
                    class="edit-card"
                    :isClone="true"
                    :groups="board.groups"
                    :group="currGroup"
                    :currPosition="currPosition"
                    @moveCard="moveCard"
            /></pop-up>
            <button class="action-btn" @click="changeDueDate">
                Change Due Date
                <date-picker
                    ref="date-picker"
                    class="date-picker"
                    slot="date-picker"
                    :dueDate="card.dueDate"
                    v-if="isPopUp"
                    @setDate="setNewDate"
                />
            </button>
        </div>
    </section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import popUp from '@/cmps/card/card-details/pop-up.cmp';
import addMembers from '@/cmps/custom-elements/add-members.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-details/card-labels.cmp';
import cardMove from '@/cmps/card/card-details/card-move.cmp';
import { utilService } from '@/services/util.service.js'

export default {
    props: {
        card: Object,
        board: Object
    },
    data() {
        return {
            cardTxt: this.card.title,
            isPopUp: false,
            currPopUp: null,
        }
    },
    computed: {
        dueDateStyle() {
			if (this.card.dueDate - Date.now() < 24 * 60 * 60 * 1000) return { color: '#121212', backgroundColor: '#ec9488' }
			if (this.card.isDone) return { color: '#fff', backgroundColor: '#61bd4f' }
			else return {}
		},
        labelsSelected() {
			if (!this.card.labels) return [];
			const selectIds = this.card.labels.map(label => label.id);
			const selctLabels = this.board.labels.filter(label => selectIds.includes(label.id));
			return selctLabels.map(label => label.color);
		},
        dueDate() {
            return this.currPopUp === 'dueDate';
        },
        currGroup() {
            const group = this.board.groups.find(group => group.cards.some(card => card.id === this.card.id));
            console.log('currGroup', group.title);
            return group;
        },
        currPosition() {
            return this.currGroup.cards.findIndex(card => card.id === this.card.id) + 1;
        },
        isCmpOpen() {
            return (cmpName) => this.isPopUp && this.currPopUp === cmpName;
        },
        boardMembers() {
            if (!this.board.isPrivate) return utilService.deepCopy(this.$store.getters.users);
            return this.board.members;
        },
    },
    methods: {
        changeDueDate() {
            this.isPopUp = true;
            this.currPopUp = 'dueDate';
        },
        closePopup() {
            this.isPopUp = false;
            this.currPopUp = '';
        },
        updateCardLabel(card) {
            this.$emit('updateCardLabel', card)
        },
        updateLabelTitle(labelId, title) {
            this.$emit('updateLabelTitle', labelId, title);
        },
        saveTitle() {
            this.$emit('updateCardTitle', this.cardTxt, this.card);
        },
        editLabel() {
            this.isPopUp = true;
            this.currPopUp = 'labels';
        },
        changeMembers() {
            this.isPopUp = true;
            this.currPopUp = 'member';
        },
        move() {
            this.isPopUp = true;
            this.currPopUp = 'move';
        },
        copy() {
            this.isPopUp = true;
            this.currPopUp = 'clone';
        },
        moveCard(stat) {
            const status = stat;
            status.cardId = this.card.id
            console.log(status);
            this.$emit('moveCard', status);
            this.closePopup();
        },
        cardMembers() {
            if (!this.card.members) {
                this.card.members = [];
            }
            return this.card.members;
        },
        updateMembers(userId) {
            this.$emit('updateMembers', userId, this.card)
        },
        setNewDate(dueDate) {
            this.card.isDone = false;
            if (this.card.dueDate) {
                delete this.card.dueDate;
            }
            this.card.dueDate = dueDate;
            this.$emit('updateCard', this.card);
            this.isPopUp = false;
            this.currPopUp = null;
        },
    },
    mounted() {
        setTimeout(() => this.$refs['card-title'].focus(), 0);
        console.log(this.card.id);
    },
    components: {
        popUp,
        addMembers,
        cardLabels,
        cardMove,
        datePicker,
        customAvatar
    }
}
</script>

<style>
</style>