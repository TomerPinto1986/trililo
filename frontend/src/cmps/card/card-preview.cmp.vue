<template>
    <section class="card-preview flex f-col">
        <div v-if="card.style.headerColor" class="card-header" :style="headerStyle"></div>
        <div class="card-info flex f-col">
            <ul v-if="labelsSelected.length" class="label-marks flex wrap">
                <li class="flex" v-for="label in labelsSelected" :key="label">
                    <div
                        class="label"
                        :style="{ backgroundColor: label }"
                    ></div>
                </li>
            </ul>
            <span>{{ card.title }}</span>
            <div
                class="attachment"
                v-if="card.attachments && card.attachments.length"
            >
                <img :src="`${card.attachments[0].src}`" />
            </div>
        </div>
        <div class="icons flex wrap">
            <span class="small-icons">
                <i v-if="card.dueDate" :style="dueDate" class="far fa-clock">{{ localTime }}</i>
                <i v-if="card.description" class="fas fa-align-left"></i>
                <i v-if="card.checklist" class="fas fa-list"></i>
                <i
                    v-if="card.attachments && card.attachments.length"
                    class="fas fa-paperclip"
                ></i>
            </span>
            <span class="flex" v-if="card.members && card.members.length">
                <div class="card-membes" v-for="member in card.members" :key="member._id">
                    <avatar :size="30" :username="member.username"></avatar>
                </div>
            </span >
        </div>
    </section>
</template>

<script>
import avatar from 'vue-avatar';

export default {
    props: {
        card: Object,
        labels: Array
    },
    data() {
        return {
        }
    },
    computed: {
        dueDate(){
            if (this.card.dueDate - Date.now()< 24 * 60 * 60 * 1000) return {color: '#fff',backgroundColor: 'rgba(255, 0, 0, 0.664)'}
            if (this.card.dueDate - Date.now()< 7*24 * 60 * 60 * 1000) return {color: '#121212', backgroundColor: 'rgba(255, 255, 0, 0.616)'}
            else return {color: '#fff', backgroundColor: 'rgba(0, 128, 0, 0.664)'}
        },
        localTime() {
            let month = (new Date(this.card.dueDate)).getMonth()+ 1;
            switch (month) {
        case 1:
            month = ('Jan')
            break;
        case 2:
            month = ('Feb')
            break;
        case 3:
            month = ('Mar')
            break;
        case 4:
            month = ('Apr')
            break;
        case 5:
            month = ('May')
            break;
        case 6:
            month = ('Jun')
            break;
        case 7:
            month = ('Jul')
            break;
        case 8:
            month = ('Aug')
            break;
        case 9:
            month = ('Sep')
            break;
        case 10:
            month = ('Oct')
            break;
        case 11:
            month = ('Nov')
            break;
        case 12:
            month = ('Dec')
            break;
    }
    let day = (new Date(this.card.dueDate)).getDay();
    return month + ' ' +day
         
        },
        // month(){
        // 	return (new Date(this.card.dueDate)).getMonth();
        // },
        // day(){
        // 	return (new Date(this.card.dueDate)).getDay();
        // },
        headerStyle() {
            return { background: this.card.style.headerColor }
        },
        labelsSelected() {
            if (!this.card.labels) return [];
            const selectIds = this.card.labels.map(label => label.id);
            const selctLabels = this.labels.filter(label => selectIds.includes(label.id));
            return selctLabels.map(label => label.color);
        }
    },
    methods: {

    },
    created() {
    },
    components: {
        avatar
    }
};
</script>