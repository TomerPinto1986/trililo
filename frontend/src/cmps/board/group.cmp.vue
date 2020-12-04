<template>
    <section v-if="group" class="group flex f-col">
        <div class="group-header handle">
            <input
                type="text"
                class="title"
                v-model="group.title"
                @change="emitChange"
            />
        </div>
        <i @click="toggleMenu" class="fal fa-ellipsis-h menu-btn"></i>
        <group-menu
            v-if="isMenu"
            :style="menuPosition"
            @closeMenu="toggleMenu"
            @addCard="addCard"
            @deleteGroup="emitDelete(group.id)"
            @cloneGroup="cloneGroup"
            @openMove="openMove"
            @openSort="openSort"
            @backToMenu="backToMenu"
        >
            <template v-if="isMove || isSort">
                <i
                    data-name="group-menu"
                    @click="backToMenu"
                    slot="back-btn"
                    class="fas fa-chevron-left back-btn"
                ></i>
                <template v-if="isMove">
                    <span class="header" slot="header"> Move List </span>
                    <div class="content" slot="body">
                        Move To:
                        <el-select
                            class="move-select"
                            @change="changeGroupPos"
                            v-model="pos"
                        >
                            <el-option
                                v-for="idx in board.groups.length"
                                :key="idx"
                                :label="idx"
                                :value="idx"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template v-if="isSort">
                    <span class="header" slot="header"> Sort List </span>
                    <div class="content" slot="body">
                        <div @click="sortBy('createdAt', 1)">
                            Date Created (Newest First)
                        </div>
                        <div @click="sortBy('createdAt', -1)">
                            Date Created (Oldest First)
                        </div>
                        <div @click="sortBy('title', 1)">
                            Card Name (Alphabetically)
                        </div>
                        <!-- <div
								@click="sortBy('dueDate', -1)"
								v-if="hasDueDate"
							>
								Due Date
							</div> -->
                    </div>
                </template>
            </template>
        </group-menu>
        <draggable
            class="drag-area"
            ghostClass="ghost"
            chosenClass="chosen"
            dragClass="drag"
            :list="group.cards"
            :group="'group'"
            :forceFallback="true"
            :emptyInsertThreshold="100"
            @change="update($event)"
            @start="isDrag = true"
            @end="isDrag = false"
        >
            <card-preview
                v-for="(card, idx) in cardsToShow"
                :key="card.id"
                :data-id="idx"
                :card="card"
                :labels="labels"
                :activities="activities"
                @openEditCard="emitOpenEditCard"
                @openDetails="openDetails"
            />
        </draggable>
        <div class="add-card-container" @click.stop>
            <template v-if="isAdding">
                <!-- add closing when pressing outside of textarea -->
                <textarea
                    @keydown.enter.prevent
                    @keyup.enter="saveCard"
                    ref="card-title"
                    class="list-card-composer-textarea js-card-title"
                    placeholder="Enter a title for this card…"
                    maxlength="120"
                    v-model="newCardTxt"
                ></textarea>
                <div class="add-card-btns flex">
                    <button @click="saveCard" class="add-btn">Add Card</button>
                    <i
                        @click="closeCardAdd"
                        class="el-icon-close close-btn"
                    ></i>
                </div>
            </template>
            <div v-else @click="addCard" class="open-add-btn">
                <i class="el-icon-plus"></i>
                <span>{{ addBtnTxt }}</span>
            </div>
        </div>
    </section>
</template>

<script>
import draggable from 'vuedraggable'
import cardPreview from '../card/card-preview.cmp';
import groupMenu from './group-menu.cmp'
import { utilService } from '@/services/util.service'
const Swal = require('sweetalert2');

export default {
    props: {
        group: Object,
        labels: Array,
        activities: Array,
        filterBy: Object,
        isCloseAdd: Boolean,
        board: Object,
        groupIdx: Number,
        clickPos: Object

    },
    data() {
        return {
            isAdding: false,
            newCardTxt: '',
            isMenu: false,
            isDrag: false,
            isMove: false,
            isSort: false,
            pos: null,

        }
    },
    computed: {
        addBtnTxt() {
            return (this.group.cards.length) ? 'Add another card' : 'Add a card';
        },
        cardsToShow() {
            if (!this.filterBy) return this.group.cards
            const cards = this.group.cards.filter(card => {
                if (!card.labels) card.labels = [];
                if (!card.members) card.members = [];
                return card.title.toLowerCase().includes(this.filterBy.txt.toLowerCase()) &&
                    (!this.filterBy.labelsIds.length || this.filterBy.labelsIds.every(id => card.labels.some(label => label.id === id))) &&
                    (!this.filterBy.membersIds.length || this.filterBy.membersIds.every(id => card.members.some(member => member._id === id)))
            })
            return cards
        },
        hasDueDate() {
            return this.group.cards.some(card => card.dueDate)
        },
        menuPosition() {
            if (!this.clickPos) return '290px'
            const x = this.clickPos.width - this.clickPos.x
            return { 'left': (x < 290) ? x - 24 + this.clickPos.offsetX + 'px' : 275 + 'px' };
        }

    },
    methods: {
        toggleMenu() {
            this.isMenu = !this.isMenu;
            this.isMove = false;
            this.isSort = false;
        },
        addCard() {
            this.isAdding = true;
            setTimeout(() => this.$refs['card-title'].focus(), 0);
        },
        saveCard() {
            if (!this.newCardTxt) return;
            this.$emit('newCard', this.newCardTxt, this.group.id);
            this.newCardTxt = ''
            this.$refs['card-title'].focus()
        },
        closeCardAdd() {
            this.newCardTxt = '';
            this.isAdding = false;
        },
        openDetails(cardId) {
            const boardId = this.$route.params.boardId
            this.$router.push(`/board/${boardId}/card/${cardId}`)
        },
        emitChange() {
            this.$emit('change', this.group)
        },
        async emitDelete(groupId) {
            const userAnc = await Swal.fire({
                position: 'top-end',
                title: 'Are you sure you want to delete this list?',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: '#455a64',
                cancelButtonColor: '#ff505b',
                confirmButtonText: 'Delete'
            });
            if (!userAnc.isConfirmed) return;
            this.$emit('delete', groupId);
        },
        update() {
            this.emitChange();
        },
        openMove() {
            this.isMove = true;
        },
        openSort() {
            this.isSort = true;
        },
        cloneGroup() {
            var newGroup = utilService.deepCopy(this.group);
            newGroup.id = utilService.makeId();
            var numOfCards = newGroup.cards.length;
            for (let i = 0; i < numOfCards; i++) {
                newGroup.cards[i].id = utilService.makeId();
            }
            this.$emit('addClone', newGroup)
        },
        changeGroupPos(newPos) {
            this.$emit('moveGroup', this.groupIdx, newPos)
            this.isMenu = false;
            this.isMove = false;
        },
        backToMenu() {
            this.isMove = false;
            this.isSort = false;
        },
        sortBy(item, diff) {
            var group = utilService.deepCopy(this.group);
            group.cards.sort((a, b) => {
                if (item === 'title') {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1 * diff;
                    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1 * diff;
                    return 0;
                } else {
                    // if (item === 'dueDate') {
                    // 	if (!a.dueDate && b.dueDate) return -1
                    // 	else if (a.dueDate && !b.dueDate) return 1
                    // 	else if (!a.dueDate && !b.dueDate) return 0
                    // }
                    if (a[item] < b[item]) return -1 * diff;
                    if (a[item] > b[item]) return 1 * diff;
                    return 0;
                }
            })
            this.$emit('updateGroup', group)
        },
        emitOpenEditCard(card) {
            this.$emit('openEditCard', card)
        },
        checkClickPos() {
            this.closeCardAdd();
        }

    },
    created() {
        this.pos = this.groupIdx + 1;
        setTimeout(() => {
            window.addEventListener('click', this.checkClickPos)
        }, 1000)
    },
    destroyed() {
        window.removeEventListener('click', this.checkClickPos)
    },
    components: {
        cardPreview,
        draggable,
        groupMenu
    }
};
</script>

