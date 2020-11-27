<template>
    <section class="card-label">
        <div class="label-header">
            <h3>Labels</h3>
            <button>X</button>
        </div>
        <div class="label-main">
            <!-- <ul class="label-list">
                <li>
                    <div class="label" v-for="label in labels" :key="label.id"></div>
                    <button><i class="fal fa-pen"></i></button>
                </li>
            </ul> -->
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            labels: [
                {
                    id: 'l101',
                    color: '#61bd4f',
                    title: '',
                    isSelected: false
                },
                {
                    id: 'l102',
                    color: '#f2d600',
                    title: '',
                    isSelected: false
                },
                {
                    id: 'l103',
                    color: '#ff9f1a',
                    title: '',
                    isSelected: false
                },
                {
                    id: 'l104',
                    color: '#eb5a46',
                    title: '',
                    isSelected: false
                },
                {
                    id: 'l105',
                    color: '#c377e0',
                    title: '',
                    isSelected: false
                },
                {
                    id: 'l106',
                    color: '#0079bf',
                    title: '',
                    isSelected: false
                }
            ]
        };
    }
};
</script>