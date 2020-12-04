<template>
	<section class="card-menu-edit flex" :style="menuPos" :class="menuClass">
		<div class="flex f-col">
			<div class="title-edit mini-preview icons flex wrap">
				<ul
					v-if="card.labels && labelsSelected.length"
					class="label-marks flex wrap"
				>
					<li
						class="flex"
						v-for="label in labelsSelected"
						:key="label"
					>
						<div
							class="label"
							:style="{ backgroundColor: label }"
						></div>
					</li>
				</ul>
				<textarea
					@keydown.enter.prevent
					@keyup.enter="saveTitle"
					ref="card-title"
					class="title-edit-menu-bar"
					placeholder="Enter a title for this card…"
					maxlength="120"
					v-model="cardTxt"
				></textarea>
				<div class="icons flex wrap">
					<span class="small-icons">
						<i
							v-if="card.dueDate"
							:style="dueDateStyle"
							class="far fa-clock"
						>
							<span>
								{{
									moment(card.dueDate).format("MMM Do")
								}}</span
							>
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
			<button class="action-btn" @click="editLabel" :class="btnsClass">
				<div class="flex">
					<img
						class="icon-btn"
						src="@/assets/svg/label-white.svg"
						alt=""
					/>
					Edit Labels
				</div>
				<pop-up
					class="edit-card"
					v-if="board && isCmpOpen('labels')"
					@closePopup="closePopup"
					:style="popupPos"
				>
					<card-labels
						:card="card"
						:boardLabels="board.labels"
						@updateCard="updateCardLabel"
						@updateLabelTitle="updateLabelTitle"
						@setHeight="setPopupHeight"
					/>
				</pop-up>
			</button>
			<button
				class="action-btn"
				@click="changeMembers"
				:class="btnsClass"
			>
				<div class="flex">
					<img
						class="icon-btn"
						src="@/assets/svg/member-white.svg"
						alt=""
					/>
					Change Members
				</div>
				<pop-up
					class="edit-card"
					v-if="isCmpOpen('member')"
					@closePopup="closePopup"
					:style="popupPos"
					><add-members
						:cardMembers="cardMembers()"
						:boardMembers="boardMembers"
						@updateMembers="updateMembers"
						@setHeight="setPopupHeight"
					/>
				</pop-up>
			</button>
			<button class="action-btn" @click="move" :class="btnsClass">
				<div class="flex">
					<img
						class="icon-btn"
						src="@/assets/svg/move-white.svg"
						alt=""
					/>
					Move
				</div>
				<pop-up
					class="edit-card"
					v-if="isCmpOpen('move')"
					@closePopup="closePopup"
					:style="popupPos"
				>
					<card-move
						:isClone="false"
						:groups="board.groups"
						:group="currGroup"
						:currPosition="currPosition"
						@moveCard="moveCard"
						@setHeight="setPopupHeight"
				/></pop-up>
			</button>
			<button class="action-btn" @click="copy" :class="btnsClass">
				<div class="flex">
					<img
						class="icon-btn"
						src="@/assets/svg/copy-white.svg"
						alt=""
					/>
					Copy
				</div>
				<pop-up
					class="edit-card"
					v-if="isCmpOpen('clone')"
					@closePopup="closePopup"
					:style="popupPos"
				>
					<card-move
						:isClone="true"
						:groups="board.groups"
						:group="currGroup"
						:currPosition="currPosition"
						@moveCard="moveCard"
				/></pop-up>
			</button>
			<button class="action-btn" @click="changeDueDate">
				<div class="flex">
					<img
						class="icon-btn"
						src="@/assets/svg/clock-white.svg"
						alt=""
					/>
					Change Due Date
				</div>
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
		board: Object,
		clickPos: Object

	},
	data() {
		return {
			cardTxt: this.card.title,
			isPopUp: false,
			currPopUp: null,
			activities: this.board.activities,
			popupHeight: null,
			newClickPos: {}
		}
	},
	computed: {
		commentsLen() {
			if (!this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length) return
			return ' ' + this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length;
		},
		dueDateStyle() {
			if (this.card.isDone) return { color: 'white', backgroundColor: '#5aac44' }
			if (this.card.dueDate < Date.now()) return { color: 'white', backgroundColor: '#ec9488' }
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
		menuPos() {
			const xDiff = (this.clickPos.width - this.clickPos.x - this.clickPos.offsetX < 190) ? 165 : 0;
			const yDiff = (this.clickPos.height - this.clickPos.y < 200) ? 75 : 0;
			const x = this.clickPos.x - this.clickPos.offsetX + 14 - 280 - xDiff;
			const y = this.clickPos.y - 18 - this.clickPos.offsetY - yDiff;
			return { 'left': x + 'px', 'top': y + 'px' }
		},
		menuClass() {
			return { 'rtl': (this.clickPos.width - this.clickPos.x - this.clickPos.offsetX < 190) }
		},
		btnsClass() {
			console.log(!this.isPopUp)
			return { 'no-popup': !this.isPopUp }
		},
		popupPos() {
			const yPos = (this.newClickPos.height - this.newClickPos.y < this.popupHeight + 85)
			const xPos = this.newClickPos.width - this.newClickPos.x + this.newClickPos.offsetX 
			const isRtl = (this.clickPos.width - this.clickPos.x - this.clickPos.offsetX < 190) 
			const left = (isRtl) ? 'unset' :  (xPos < 330) ? xPos - 330 + 'px' : 0;
			const right = (isRtl) ? 0 : 'unset'
			const top = (yPos) ? 'unset' : '35px';
			const bottom = (yPos) ? '35px' : 'unset';
			return { 'top': top, 'bottom': bottom, 'left': left, 'right': right }
		}
	},
	methods: {
		// openPopup(cmp) {
		// 	this.isPoUp = true;
		// 	this.currPopUp = cmp;
		// 	if (cmp === 'dueDate') this.$nextTick(() => {
		// 		document.querySelector('.el-date-editor .el-input__inner').focus();
		// 	})
		// },
		changeDueDate() {
			this.$emit('isEditing', true)
			this.isPopUp = true;
			this.currPopUp = 'dueDate';
			this.$nextTick(() => {
				document.querySelector('.el-date-editor .el-input__inner').focus();
			})
		},
		closePopup() {
			this.isPopUp = false;
			this.currPopUp = '';
			this.$emit('isEditing', false)
		},
		updateCardLabel(card) {
			this.$emit('updateCardLabel', card)
		},
		updateLabelTitle(labelId, title) {
			this.$emit('updateLabelTitle', labelId, title);
		},
		saveTitle() {
			this.$emit('updateCardTitle', this.cardTxt, this.card);
			this.closePopup();
		},
		editLabel(ev) {
			this.setClickPos(ev)
			this.isPopUp = true;
			this.$emit('isEditing', true)
			this.currPopUp = 'labels';
		},
		changeMembers(ev) {
			this.setClickPos(ev)
			this.isPopUp = true;
			this.$emit('isEditing', true)
			this.currPopUp = 'member';
		},
		move(ev) {
			this.setClickPos(ev)
			this.isPopUp = true;
			this.$emit('isEditing', true)
			this.currPopUp = 'move';
		},
		copy(ev) {
			this.setClickPos(ev)
			this.isPopUp = true;
			this.$emit('isEditing', true)
			this.currPopUp = 'clone';
		},
		moveCard(stat) {
			const status = stat;
			status.cardId = this.card.id
			console.log(status);
			this.$emit('moveCard', status, this.card);
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
			let txt;
			if (this.card.dueDate) {
				delete this.card.dueDate;
				txt = 'changed'
			} else {
				txt = 'added'
				this.card.isDone = false;
			}
			this.card.dueDate = dueDate;
			this.$emit('updateCard', this.card);
			this.closePopup();
			this.$emit('updateActivities', `${txt} due date to `, this.card)
		},
		setPopupHeight(height) {
			this.popupHeight = height;
		},
		setClickPos({ x, y, offsetX, offsetY }) {
			if (this.isPopUp) return
			const pos = { x, y, width: window.innerWidth, height: window.innerHeight, offsetX, offsetY }
			this.newClickPos = pos;
		},
	},
	mounted() {
		this.$nextTick(() => this.$refs['card-title'].focus());
	},
	created() {
		this.newClickPos = utilService.deepCopy(this.clickPos)
	},
	destroyed() {
		this.$emit('isEditing', false)
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