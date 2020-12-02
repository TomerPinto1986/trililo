<template>
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
</template>

<script>
import activityPreview from '../../activity-preview.cmp';
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'
import { socketService } from '../../../services/socket.service';

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
            this.$emit('addActivity', null, this.card, msg.txt, byMember);
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
        customAvatar
    }
};
</script>