<template>
    <div class="row">
        <main-header />
        <div class="col-md-4 col-md-offset-2">
            <section class="list">
                <header>UPCOMING</header>
                <draggable
                    class="drag-area"
                    :list="tasksNotCompletedNew"
                    :options="{ animation: 200, group: 'status' }"
                    :element="'article'"
                    @add="onAdd($event, false)"
                    @change="update"
                >
                    <article
                        class="card"
                        v-for="(task, idx) in tasksNotCompletedNew"
                        :key="idx"
                        :data-id="idx"
                    >
                        <header>
                            {{ task }}
                        </header>
                    </article>
                </draggable>
            </section>
        </div>
        <div class="col-md-4">
            <section class="list">
                <header>COMPLETED</header>
                <draggable
                    class="drag-area"
                    :list="tasksCompletedNew"
                    :options="{ animation: 200, group: 'status' }"
                    :element="'article'"
                    @add="onAdd($event, true)"
                    @change="update"
                >
                    <article
                        class="card"
                        v-for="(task, idx) in tasksCompletedNew"
                        :key="idx"
                        :data-id="idx"
                    >
                        <header>
                            {{ task }}
                        </header>
                    </article>
                </draggable>
            </section>
        </div>
        <div class="col-md-4">
            <section class="list">
                <header>COMPLETED</header>
                <draggable
                    class="drag-area"
                    :list="tasksCompletedNew"
                    :options="{ animation: 200, group: 'status' }"
                    :element="'article'"
                    @add="onAdd($event, true)"
                    @change="update"
                >
                    <article
                        class="card"
                        v-for="(task, idx) in tasksCompletedNew"
                        :key="idx"
                        :data-id="idx"
                    >
                        <header>
                            {{ task }}
                        </header>
                    </article>
                </draggable>
            </section>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import axios from 'axios';
import mainHeader from '../cmps/main-header.cmp';

export default {
    components: {
        draggable,
        mainHeader
    },
    data() {
        return {
            tasksNotCompletedNew: ['lolo1', 'lolo2', 'lol3', 'lolo4', 'lolo5', 'lolo6', 'lolo7', 'lolo8'],
            tasksCompletedNew: ['lolo1', 'lolo2', 'lolo', 'lolo', 'lolo', 'lolo', 'lolo', 'lolo']
        }
    },
    methods: {
        onAdd(event, status) {
            let id = event.item.getAttribute('data-id');
            axios.patch('/demos/tasks/' + id, {
                status: status
            }).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
        },
        update() {
            this.tasksNotCompletedNew.map((task, index) => {
                task.order = index + 1;
            });

            this.tasksCompletedNew.map((task, index) => {
                task.order = index + 1;
            });

            let tasks = this.tasksNotCompletedNew.concat(this.tasksCompletedNew);

            axios.put('/demos/tasks/updateAll', {
                tasks: tasks
            }).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }

    }
}
</script>

<style>
.row {
    height: fit-content;
}
.list {
    background-color: #26004d;
    border-radius: 3px;
    margin: 5px 5px;
    padding: 10px;
    width: 100%;
}
.list > header {
    font-weight: bold;
    color: white;
    text-align: center;
    font-size: 20px;
    line-height: 28px;
    cursor: grab;
}
.list article {
    border-radius: 3px;
    margin-top: 10px;
}

.list .card {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    padding: 15px 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bolder;
}
.list .card:hover {
    background-color: #f0f0f0;
}
.drag-area {
    min-height: 10px;
}
</style>