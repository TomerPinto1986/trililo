import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
        currBoard: null,
        currCard: null,
        emptyCard: null,
        emptyGroup: null
    },
    getters: {
        boards(state) {
            return state.boards;
        },
        currBoard(state) {
            return state.currBoard;
        },
        currCard(state) {
            return state.currCard;
        },
        currGroup(state) {
            const currGroup = state.currBoard.groups.find(group => group.cards.some(card => card.id === state.currCard.id))
            return currGroup
        },
        activities(state) {
            return state.currCard.activities;
        },
        emptyCard(state) {
            return state.emptyCard;
        },
        emptyGroup(state) {
            return state.emptyGroup;
        },
    },
    mutations: {
        setBoards(state, boards) {
            state.boards = boards;
        },
        deleteBoard(state, boardId) {
            const idx = state.boards.findIndex(board => board._id === boardId);
            state.boards.splice(idx, 1);
        },
        addNewBoard(state, newBoard) {
            state.boards.push(newBoard);
        },
        setCurrBoard(state, { board }) {
            // state.currBoard = JSON.parse(JSON.stringify(board));
            const newBoard = JSON.parse(JSON.stringify(board));
            state.currBoard = newBoard;
            console.log(state.currBoard, board)
        },
        setCurrCard(state, { cardId }) {
            state.currBoard.groups.forEach(group => {
                const card = group.cards.find(card => card.id === cardId);
                if (card) {
                    state.currCard = card;
                }
            })
        },
        updateCurrCard(state, { card }) {
            state.currCard = card;
        },
        updateCurrBoard(state, { card }) {
            const cardId = card.id
            state.currBoard.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === cardId);
                console.log(cardIdx)
                console.log(group.cards)
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card)
            })
        },
        setEmptyCard(state) {
            const card = JSON.parse(JSON.stringify(boardService.emptyCard()));
            console.log('card:', card)
            state.emptyCard = card
        },
        setEmptyGroup(state) {
            const group = JSON.parse(JSON.stringify(boardService.emptyGroup()));
            console.log('group:', group)
            state.emptyGroup = group
        },
        updateCardStatus(state, { status }) {
            if ((status.startGroup === status.endGroup || !status.endGroup) &&
                (status.startPos === status.endPos || !status.endPos)) {
                return
            }
            const startGroupIdx = state.currBoard.groups.findIndex(group => group.id === status.startGroup)
            state.currBoard.groups[startGroupIdx].cards.splice(status.startPos, 1);
            if (!status.endGroup) {
                state.currBoard.groups[startGroupIdx].cards.splice(status.endPos, 0, state.currCard);
            } else {
                const endGroupIdx = state.currBoard.groups.findIndex(group => group.id === status.endGroup);
                if (!status.endPos) {
                    state.currBoard.groups[endGroupIdx].cards.push(state.currCard);
                    return
                }
                state.currBoard.groups[endGroupIdx].cards.splice(status.endPos, 0, state.currCard);
            }
        },
        saveCard(state, { newCard, groupId }) {
            const group = state.currBoard.groups.find(group => group.id === groupId)
            group.cards.push(newCard)
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            console.log('load boards', boards);
            commit('setBoards', boards)
        },
        async updateBoard({ state }, { newBoard }) {
            state.currBoard = newBoard
            return boardService.save(state.currBoard);
        },
        async loadBoard({ commit }, { boardId }) {
            const board = await boardService.getById(boardId)
            commit({ type: 'setCurrBoard', board })
            // return state.currBoard;
        },
        async deleteBoard({ commit }, boardId) {
            await boardService.remove(boardId);
            commit({ type: 'deleteBoard', boardId });
        },
        async createNewBoard(context, newBoardTxt) {
            const newBoard = boardService.emptyBoard();
            newBoard.title = newBoardTxt;
            newBoard.byMember = context.getters.loggedinUser;
            newBoard.members.push(context.getters.loggedinUser);
            const savedBoard = await boardService.save(newBoard);
            context.commit('addNewBoard', savedBoard);
            return savedBoard;
        },
        async saveCard({ commit, state }, { newCard, groupId }) {
            commit({ type: 'saveCard', newCard, groupId });
            console.log('board:', board);
            const board = await boardService.save(state.currBoard);
            commit({type:'setCurrBoard', board});

        },
        deleteCard({ state }, { cardId }) {
            state.currBoard.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(card => card.id === cardId);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1);
            });
            return boardService.save(state.currBoard)
        },
        updateCard({ state }, { card }) {
            state.currBoard.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(currCard => currCard.id === card.id);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1, card);
            });
            return boardService.save(state.currBoard)
        },
        addNewGroup({ state }, { newGroup }) {
            state.currBoard.groups.push(newGroup)
            return boardService.save(state.currBoard)
        },
        deleteGroup({ state }, { groupId }) {
            const groupIdx = state.currBoard.groups.findIndex(group => group.id === groupId)
            state.currBoard.groups.splice(groupIdx, 1)
            return boardService.save(state.currBoard)
        },
        updateGroup({ state }, { group }) {
            console.log(group)
            const groupIdx = state.currBoard.groups.findIndex(currGroup => currGroup.id === group.id)
            state.currBoard.groups.splice(groupIdx, 1, group)
            boardService.save(state.currBoard)
            return boardService.save(state.currBoard)
        }
    }
}