<template>
    <section
        v-if="attachmentsToShow && attachmentsToShow.length"
        class="attachments"
    >
        <h2>Attachments</h2>
        <ul>
            <li
                class="attachment-card"
                v-for="(attachment, idx) in attachmentsToShow"
                :key="idx"
            >
                <img  :src="attachment.src" />
                {{ attachment.name }}
                <button @click="emitDelete(attachment.id)">Delete</button>
            </li>
        </ul>
    </section>
</template>

<script>
import { utilService } from '@/services/util.service'
export default {
    props: {
        attachments: Array,
    },
    data() {
        return {
            isShowAll: false,
        }
    },
    computed: {
        attachmentsToShow() {
            // return (this.isShowAll) ? this.attachments : this.attachments.slice(0, 4);
            return utilService.deepCopy(this.attachments);
        }
    },
    methods: {
        emitDelete(attachmentId) {
            const attachments = this.attachmentsToShow;
            const attachmentIdx = attachments.findIndex(attachment => attachment.id === attachmentId)
            if (attachmentIdx !== -1) attachments.splice(attachmentIdx, 1);
            this.$emit('updateAttachments', attachments)
        }
    }
}
</script>

