<template>
    <section v-if="user" class="card-activity">
        <h2>activity:</h2>
        <button>Show Details</button>
        <avatar username="user.username"></avatar>
        <input type="text" placeholder="Write a comment..." @keydown="typing" v-model="msg.txt">
        <button @click="sendMsg">Send</button>
        <span>{{chat}}</span>
        <template v-if="activities && activities.length">
            <activity-preview v-for="activity in activities" :key="activity.id" :activity="activity" />
        </template>
    </section>
</template>

<script>
import activityPreview from '../activity-preview.cmp';
import avatar from 'vue-avatar';
import { socketService } from '../../services/socket.service';

export default {
	props: {
		activities: Array,
		user: Object,
		card: Object
	},
	data() {
		return {
			msg: {
				from: null,
				txt: ''
			},
			chat: [],
			userTyping: null,
			timeOutTyping: null
		}
	},
	computed: {
	},
	methods: {
		sendMsg() {
			socketService.emit('chat-newMsg', this.msg)
			this.msg.txt = '';
		},
		addMsg(chat) {
			this.userTyping = null
			this.chat = chat
		},
		typing() {
			socketService.emit('typing', this.msg.from)
		},
		setUserTyping(username) {
			this.userTyping = username
			if (this.timeOutTyping) clearTimeout(this.timeOutTyping)
			this.timeOutTyping = setTimeout(() => {
				this.userTyping = null
			}, 1500)
		}
	},
	created() {
		
		this.from = this.user.username;
		socketService.setup();
		socketService.emit('card-topic', this.card.id);
		socketService.on('chat-history', (chat => this.chat = chat))
		socketService.on('chat-addMsg', this.addMsg);
		socketService.on('user-typing', this.setUserTyping);
	},
	destroyed() {
		socketService.off('chat-addMsg', this.addMsg)
		socketService.terminate();
	},
	components: {
		activityPreview,
		avatar
	}
};
</script>