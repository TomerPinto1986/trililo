<template>
    <section class="card-activity">
        <h2>activity:</h2>
        <button v-if="!isAllActivities" @click="toggleShowDetails">Show Details</button>
        <button v-else @click="toggleShowDetails">Hide Details</button>
        <div class="flex">
            <avatar :size="35" :username="user.username"></avatar>
            <input
                type="text"
                placeholder="Write a comment..."
                @keydown="typing"
                v-model="msg.txt"
            />
            <button @click="sendMsg">Send</button>
        </div>
        <span v-if="userTyping"><avatar :size="35" :username="userTyping"></avatar> Adding a comment</span>
        <template v-if="activitiesToShow && activitiesToShow.length">
            <activity-preview
                v-for="activity in activitiesToShow"
                :key="activity.id"
                :activity="activity"
            />
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
        card: Object,
        isShowDetails: Boolean
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
        miniUser(){
            return {
                _id: this.user._id,
                username: this.user.username,
                url: this.user.url
            }
        },
        activitiesToShow() {
            if (!this.isAllActivities){
                return this.activities.filter(activity => activity.comment && activity.comment.length)
            }
            return (this.activities);
        }
    },
    methods: {
        toggleShowDetails() {
            this.isAllActivities = !this.isAllActivities;
        },
        sendMsg() {
            socketService.emit('activity-newMsg', this.msg)
            this.msg.txt = '';
        },
        addMsg(msg) {
            this.userTyping = null;
            const byMember = {
                _id: msg.from._id,
                username: msg.from.username,
                imgUrl: msg.from.imgUrl
            };
			this.$emit('addActivity',null,this.card,msg.txt,byMember);
        },
        typing() {
            console.log('typing');
            socketService.emit('typing', this.msg.from.username);
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
        this.msg.from = this.miniUser;
        // socketService.setup();
        socketService.emit('card-topic', this.card.id);
        // socketService.on('chat-history', (chat => this.chat = chat))
        socketService.on('activity-addMsg', this.addMsg);
        socketService.on('user-typing', this.setUserTyping);
    },
    destroyed() {
        socketService.off('activity-addMsg', this.addMsg)
        // socketService.terminate();
    },
    components: {
        activityPreview,
        avatar
    }
};
</script>