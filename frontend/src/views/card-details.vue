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
			<h3>Description</h3>
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
			<card-attachments
				:card="card"
				:attachments="attachments"
				@updateAttachments="updateAttachments"
			/>
			<div class="actions flex f-col f-center">
				<button>Members</button>
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
				<button @click="setDate">Set Date</button>
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
				<date-picker v-if="dueDate" @setDate="setNewDate" />
				<card-cover
					v-if="cover"
					:color="card.style.headerColor"
					@colorChange="updateCover"
				/>
			</div>
		</div>
	</section>
</template>

<script>
import cardActivity from '@/cmps/card/card-activity.cmp';
import cardAttachments from '@/cmps/card/card-attachments.cmp';
import cardMove from '@/cmps/card/card-move.cmp';
import cardCover from '@/cmps/card/card-cover.cmp';
import datePicker from '@/cmps/custom-elements/date-picker.cmp';
import cardLabels from '@/cmps/card/card-labels.cmp';
import { utilService } from '@/services/util.service';
import { uploadImg } from '@/services/img-upload.service';

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
		setNewDate(dueDate) {
			this.card.dueDate = dueDate;
			this.isPopUp = false;

		},
		moveCard(status) {
			this.$store.commit({ type: 'updateCardStatus', status });
			const board = this.board;
			this.$store.dispatch({ type: 'updateBoard', board })
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
			this.card.attachments.push(attachment)
			console.log(this.card, 'after adding')
			this.isLoading = false;
			const board = this.board;
			board.groups.forEach(group => {
				const cardIdx = group.cards.findIndex(currCard => currCard.id === this.card.id);
				if (cardIdx !== -1) group.cards.splice(cardIdx, 1, this.card);
			})
			this.$store.dispatch({ type: 'updateBoard', board })
		},
		setCover() {
			this.currPopUp = 'cover';
			this.isPopUp = true;
		},
		updateCover(color) {
			this.card.style.headerColor = color;
			const board = this.board;
			this.$store.dispatch({ type: 'updateBoard', board })
		}
	},
	created() {
		const cardId = this.$route.params.cardId
		this.$store.commit({ type: 'setCurrCard', cardId })
		this.card = this.$store.getters.currCard;
		console.log(this.card)
	},
	destroyed() {
		this.$store.commit({ type: 'updateCurrCard', card: null })
		this.card = null;
	},
	components: {
		cardActivity,
		cardMove,
		datePicker,
		cardAttachments,
		cardCover
	}
}
</script>
