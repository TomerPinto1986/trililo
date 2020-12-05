<template>
    <section class="card-preview flex f-col" @click="emitOpenDetails">
        <div>
            <i data-name="card-edit-menu" class="edit-btn" @click="editCard()">
                <img src="@/assets/svg/edit.svg" alt="" />
                <!-- <i class="fas fa-pen edit-btn" @click.stop="editCard"> -->
            </i>
        </div>
        <div
            v-if="card.style.headerColor"
            class="card-header"
            :style="headerStyle"
        ></div>
        <div class="card-info flex f-col">
            <ul v-if="labelsSelected.length" class="label-marks flex wrap">
                <li class="flex" v-for="label in labelsSelected" :key="label">
                    <div
                        class="label"
                        :style="{ backgroundColor: label }"
                    ></div>
                </li>
            </ul>
            <span class="description">{{ card.title }}</span>
            <div
                class="attachment"
                v-if="card.attachments && card.attachments.length"
            >
                <img :src="`${card.attachments[0].src}`" />
            </div>
        </div>
        <div class="icons flex wrap">
            <span class="small-icons flex">
                <i v-if="card.dueDate" :style="dueDate" class="far fa-clock">
                    <span> {{ moment(card.dueDate).format("MMM Do") }}</span>
                </i>

                <i v-if="card.description" class="description-icon"
                    ><img src="@/assets/svg/desc.svg"
                /></i>
                <i
                    v-if="card.checklistGroup && checklist"
                    class="checklist-icon"
                    :class = "isChecklistDone"
                >
                    <img src="@/assets/svg/checklist.svg" />{{ todoStatus }}</i
                >
                <i
                    v-if="card.attachments && card.attachments.length"
                    class="fas fa-paperclip"
                ></i>
                <i v-if="commentsLen" class="flex comments-icon">
                    <img src="@/assets/svg/txtbox.svg" />
                    {{ commentsLen }}</i
                >
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
    </section>
</template>

<script>
import customAvatar from '@/cmps/custom-elements/custom-avatar.cmp'

export default {
    props: {
        card: Object,
        labels: Array,
        activities: Array
    },
    data() {
        return {
            isEditing: false,
        }
    },
    computed: {
        isChecklistDone(){
            const isDone = this.card.checklistGroup.every( checklist => checklist.items.every(item => item.isDone))
            return isDone ? 'complete' : null;
        },
        checklist() {
            return this.card.checklistGroup.some( checklist => checklist.items.length > 0)
        },
        todoStatus() {
            const totalTodos = this.card.checklistGroup.reduce((counterList, checklist) => {
                let counterItem = checklist.items.reduce((counterItem, item) => {
                    counterItem.total++;
                    if (item.isDone) counterItem.done++;
                    return counterItem;
                }, { total: 0, done: 0 })
                counterList.total += counterItem.total;
                counterList.done += counterItem.done;
                return counterList;
            }, { total: 0, done: 0 })
            const txt = `${totalTodos.done}/${totalTodos.total}`;
            return txt;
        },
        dueDate() {
            if (this.card.isDone) return { color: 'white', backgroundColor: '#5aac44' }
            if (this.card.dueDate < Date.now()) return { color: 'white', backgroundColor: '#ec9488' }
            else return {}
        },
        headerStyle() {
            return { background: this.card.style.headerColor }
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            const selctLabels = this.labels.filter(label => selectIds.includes(label.id));
            return selctLabels.map(label => label.color);
        },
        commentsLen() {
            if (!this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length) return
            return ' ' + this.activities.filter(activity => activity.comment && activity.card.id === this.card.id).length;
        }
    },
    methods: {
        editCard() {
            this.$emit('openEditCard', this.card);
            this.isEditing = true;
        },
        emitOpenDetails() {
            if (!this.isEditing) this.$emit('openDetails', this.card.id);
            this.isEditing = false;
        }
    },
    created() {
    },
    components: {
        customAvatar,
    }
};
</script>