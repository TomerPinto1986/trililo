<template>
    <section v-if="user" class="card-activity">
        <h2>activity:</h2>
        <button>Show Details</button>
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
                from: this.user.username,
                txt: ''
            },
            userTyping: null,
            timeOutTyping: null
        }
    },
    computed: {
        activitiesToShow() {
            return (this.activities);
        }
    },
    methods: {
        sendMsg() {
            socketService.emit('activity-newMsg', this.msg)
            this.msg.txt = '';
        },
        addMsg(msg) {
            this.userTyping = null;
            // this.chat = chat
            // const byMember = {
            //     _id: this.user._id,
            //     username: this.user.username,
            //     imgUrl: this.user.imgUrl
            // };
            // const activity = {
            //     txt: msg.txt,
            //     byMember,
			// };
			// if (!this.card.activities) this.card.activities = [];
			// this.card.activities.push(activity);
			// console.log(this.card,'activ???');
			this.$emit('addActivity',null,this.card,msg.txt);
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
        // socketService.on('chat-history', (chat => this.chat = chat))
        socketService.on('activity-addMsg', this.addMsg);
        socketService.on('user-typing', this.setUserTyping);
    },
    destroyed() {
        socketService.off('activity-addMsg', this.addMsg)
        socketService.terminate();
    },
    components: {
        activityPreview,
        avatar
    }
};
</script>