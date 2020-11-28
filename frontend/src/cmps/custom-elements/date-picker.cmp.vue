<template class="time-picker">
    <div class="block">
        <span class="demonstration">Default</span>
        <el-date-picker
            ref="date"
            @change="setDate"
            v-model="value1"
            type="datetime"
            placeholder="Select Due Date"
            default-time="12:00:00"
            value-format="timestamp"
            :picker-options="pickerOptions"
        >
            >
        </el-date-picker>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
                shortcuts: [
                    {
                        text: 'Tomorrow',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: 'In a week',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
            },
            value1: '',
        };
    },
    methods: {
        setDate() {
            console.log(this.value1);
            this.$emit('setDate', this.value1)
        },
        forcusInput() {
            console.log(this.$refs.date.$refs);
        }

    },
    mounted() {
        this.forcusInput();
    }
};
</script>