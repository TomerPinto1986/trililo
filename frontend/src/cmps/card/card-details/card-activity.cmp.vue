<template>
<<<<<<< HEAD
	<section class="card-activity">
		<div class="flex activities-btn">
			<h2>activity:</h2>
			<button
				class="card-details-btn"
				v-if="!isAllActivities"
				@click="toggleShowDetails"
			>
				Show Details
			</button>
			<button class="card-details-btn" v-else @click="toggleShowDetails">
				Hide Details
			</button>
		</div>
		<div class="activities flex">
			<custom-avatar
				:size="35"
				:username="user.username"
				:src="user.imgUrl"
			/>
			<div class="input-area flex f-s-between">
				<input
					type="text"
					placeholder="Write a comment..."
					@keydown="typing"
					@keyup.enter="addComment"
					v-model="msg.txt"
				/>
			</div>
			<!-- <button class="activities-send" @click="sendMsg">Send</button> -->
		</div>
		<span v-if="userTyping"
			><custom-avatar
				:size="35"
				:username="userTyping"
				:src="user.imgUrl"
			/>
			Adding a comment</span
		>
		<template v-if="activitiesToShow && activitiesToShow.length">
			<activity-preview
				v-for="activity in activitiesToShow"
				:key="activity.id"
				:activity="activity"
			/>
		</template>
	</section>
=======
    <section class="card-activity">
        <div class="flex activities-btn">
            <h2>activity:</h2>
            <button class="card-details-btn" v-if="!isAllActivities" @click="toggleShowDetails">
                Show Details
            </button>
            <button class="card-details-btn" v-else @click="toggleShowDetails">Hide Details</button>
        </div>
        <div class="activities flex">
            <custom-avatar
                :size="35"
                :username="user.username"
                :src="user.imgUrl"
            />
            <input
                type="text"
                placeholder="Write a comment..."
                @keydown="typing"
                @keyup.enter="sendMsg"
                v-model="msg.txt"
            />
            <button class="activities-send" v-if="userTyping" @click="sendMsg">Send</button>
        </div>
        <span v-if="userTyping"
            ><custom-avatar
                :size="35"
                :username="userTyping"
                :src="user.imgUrl"
            />
            Adding a comment</span
        >
        <template v-if="activitiesToShow && activitiesToShow.length">
            <activity-preview
                v-for="activity in activitiesToShow"
                :key="activity.id"
                :activity="activity"
            />
        </template>
    </section>
>>>>>>> ab504e0c4cef3171d534eeb24edd6bb04aebcb4a
</template>

<script>
import activityPreview from '../../activity-preview.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import { socketService } from '../../../services/socket.service';

export default {
	props: {
		activities: Array,
		user: Object,
        isShowDetails: Boolean,
        card: Object
	},
	data() {
		return {
			msg: {
				from: null,
				txt: ''
			},
			userTyping: null,
			timeOutTyping: null,
			isAllActivities: this.isShowDetails
		}
	},
	computed: {
		miniUser() {
			return {
				_id: this.user._id,
				username: this.user.username,
				url: this.user.url
			}
		},
		activitiesToShow() {
			if (!this.isAllActivities) {
				return this.activities.filter(activity => activity.comment && activity.comment.length)
			}
			return (this.activities);
		},
		isWriting() {
			return (this.msg.txt !== '');
		}
	},
	methods: {
		toggleShowDetails() {
			this.isAllActivities = !this.isAllActivities;
		},
		addComment() {
            this.userTyping = null;
            this.$emit('addComment', null, this.card, this.msg.txt, this.msg.from);
            this.msg.txt = '';
		},
		typing() {
			if (this.isWriting) return;
			socketService.emit('commenting', this.msg.from.username);
		},
		setUserTyping(username) {
			this.userTyping = username
			if (this.timeOutTyping) clearTimeout(this.timeOutTyping)
			this.timeOutTyping = setTimeout(() => {
				this.userTyping = null
			}, 1000)
		}
	},
	created() {
		this.msg.from = this.miniUser;
		socketService.on('user-commenting', this.setUserTyping);
	},
	components: {
		activityPreview,
		customAvatar
	}
};
</script>