<template>
    <section class="card-label">
        <label-header>
            <h3>Labels</h3>
            <button>X</button>
        </label-header>
        <label-main>
            <div class="label" v-for="label in labels" :key="label.id"></div>
        </label-main>
        <label-footer> </label-footer>
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