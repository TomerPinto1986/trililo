<template>
    <section class="item-preview">
        <input type="checkbox" v-model="isDoneToEdit" @change="toggleIsDone" />
        <span v-if="!isEdit" @click.stop="focusInput">{{ item.txt }}</span>
        <input
            v-else
            type="text"
            ref="myInput"
            v-model="txtToEdit"
            @keyup.enter.stop="updateItem"
        />
        <button @click.stop="removeItem">
            <i class="fal fa-trash-alt"></i>
        </button>
    </section>
</template>

<script>
export default {
    props: {
        item: Object
    },
    data() {
        return {
            txtToEdit: this.item.txt,
            isDoneToEdit: this.item.isDone,
            isEdit: false
        };
    },
    methods: {
        focusInput() {
            this.isEdit = true;
            setTimeout(() => {
                this.$refs.myInput.focus();
            }, 0);
        },
        updateItem() {
            this.isEdit = false;
            this.$emit('updateItem', this.item.id, this.txtToEdit);
        },
        removeItem() {
            this.isEdit = false;
            this.$emit('removeItem', this.item.id);
        },
        toggleIsDone() {
            this.isEdit = false;
            this.$emit('toggleIsDone', this.item.id);
        }
    }
};
</script>