<template>
    <section
        v-if="attachmentsToShow && attachmentsToShow.length"
        class="attachments"
    >
        <ul>
            <li
                class="attachment-card flex f-col"
                v-for="(attachment, idx) in attachmentsToShow"
                :class="attachment.imgClass"
                :key="idx"
            >
                <img :src="attachment.src" />
                <div>
                    <small>{{ attachment.name }}</small>
                    <button @click="emitDelete(attachment.id)">Delete</button>
                </div>
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

