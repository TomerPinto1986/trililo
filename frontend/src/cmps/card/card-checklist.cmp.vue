<template>
    <section class="card-checklist">
        <div class="checklist-title flex">
            <h2><i class="fab fa-black-tie"></i>{{ checklist.title }}</h2>
            <button @click="deleteChecklist">Delete</button>
        </div>
        <div class="items-container" v-if="checklist.items.length">
            <item-preview
                v-for="item in checklist.items"
                :key="item.id"
                :item="item"
                @updateItem="updateItem"
                @removeItem="removeItem"
                @toggleIsDone="toggleIsDone"
            />
        </div>
        <template v-if="isEdit">
            <input
                type="text"
                placeholder="Add an item"
                v-model="newItem"
                ref="myInput"
                @keyup.enter="saveItem"
            />
            <button @click="saveItem">Save</button>
            <button @click="cancel">Cancel</button>
        </template>
        <button v-else @click="openInput">Add an item</button>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service';
import itemPreview from './item-preview.cmp';

export default {
    props: {
        checklist: Object
    },
    data() {
        return {
            newItem: '',
            isEdit: false
        };
    },
    methods: {
        openInput() {
            this.isEdit = true;
            setTimeout(() => {
                this.$refs.myInput.focus();
            }, 0);
        },
        cancel() {
            this.newItem = '';
            this.isEdit = false;
        },
        saveItem() {
            const newChecklist = this.checklist;
            newChecklist.items.push({ id: utilService.makeId(), txt: this.newItem, isDone: false });
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        deleteChecklist() {
            this.$emit('deleteChecklist', this.checklist.id);
        },
        updateItem(itemId, newTxt) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items[idx].txt = newTxt;
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        removeItem(itemId) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items.splice(idx, 1);
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        },
        toggleIsDone(itemId) {
            let newChecklist = this.checklist;
            const idx = newChecklist.items.findIndex(item => item.id === itemId);
            newChecklist.items[idx].isDone = !newChecklist.items[idx].isDone;
            this.$emit('updeteChecklist', newChecklist);
            this.cancel();
        }
    },
    components: {
        itemPreview
    }
};
</script>