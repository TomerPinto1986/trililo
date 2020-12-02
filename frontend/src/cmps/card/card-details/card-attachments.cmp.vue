<template>
    <section
        v-if="attachmentsToShow && attachmentsToShow.length"
        class="attachments"
    >
        <ul>
            <li
                class="attachment-card flex f-col"
                :class="ratio(attachment.src)"
                v-for="(attachment, idx) in attachmentsToShow"
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
        },
        ratio(url) {
            var img = new Image();
            img.src = url;
            img.onload = () => {
                console.log('w: ' + img.width + ' / h: ' + img.height);
                const x = {
                    regular: Math.abs(img.width - img.height) <= 300,
                    portrait: img.height - img.width > 300,
                    landscape: img.width - img.height > 300
                };
                console.log('x:', x)
                return x;
            }
        }
    }
}
</script>

