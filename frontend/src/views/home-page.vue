<template>
	<div class="row">
		<div class="col-md-4 col-md-offset-2">
			<section class="list">
				<header>UPCOMING</header>
				<draggable
					class="drag-area"
					:list="tasksNotCompletedNew"
					:options="{ animation: 200, group: 'status' }"
					:element="'article'"
					@add="onAdd($event, false)"
					@change="update($event, 'tasksNotCompletedNew')"
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
					@change="update($event,'tasksCompletedNew')"
				>
					<article
						class="card"
						v-for="task in tasksCompletedNew"
						:key="task.id"
						:data-id="task.id"
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

export default {
	components: {
		draggable
	},
	data() {
		return {
			tasksNotCompletedNew: [{ id: '1', txt: '1' }, { id: '2', txt: '2' }, { id: '3', txt: '3' }, { id: '4', txt: '4' }, { id: '5', txt: '5' }],
			tasksCompletedNew: [{ id: '11', txt: '11' }, { id: '22', txt: '22' }, { id: '33', txt: '33' }, { id: '44', txt: '44' }, { id: '55', txt: '55' }]
		}
	},
	methods: {
		onAdd(event, status) {
			console.log('adding', event, status)
			let id = event.item.getAttribute('data-id');
			console.log(id)
			axios.patch('/demos/tasks/' + id, {
				status: status
			}).then((response) => {
				console.log(response.data);
			}).catch((error) => {
				console.log(error);
			})
		},
		update(ev, arr) {
			console.log('updated', ev)
			console.log('arr:', arr)
			console.log(this[arr]);
			// this.tasksNotCompletedNew.map((task, index) => {
			// 	task.order = index + 1;
			// });

			// this.tasksCompletedNew.map((task, index) => {
			// 	task.order = index + 1;
			// });

			// let tasks = this.tasksNotCompletedNew.concat(this.tasksCompletedNew);

			// axios.put('/demos/tasks/updateAll', {
			// 	tasks: tasks
			// }).then((response) => {
			// 	console.log(response.data);
			// }).catch((error) => {
			// 	console.log(error);
			// })
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