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
            state.currBoard = JSON.parse(JSON.stringify(board))
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
        // newCard(state, {newCard, groupId}){
        //     const group = state.currBoard.groups.find(group => group.id === groupId)
        //     group
        // }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)
        },
        async updateBoard({ state }, { newBoard }) {
            state.currBoard = newBoard
            return boardService.save(state.currBoard);
        },
        async getBoardById({ commit, state }, { boardId }) {
            const board = await boardService.getById(boardId)
            commit({ type: 'setCurrBoard', board })
            return state.currBoard;
        },
        async deleteBoard({ commit }, boardId) {
            await boardService.remove(boardId);
            commit({ type: 'deleteBoard', boardId });
        },
        async createNewBoard({ commit }, newBoardTxt) {
            const emptyBoard = boardService.emptyBoard();
            emptyBoard.title = newBoardTxt;
            const savedBoard = await boardService.save(emptyBoard);
            commit('addNewBoard', savedBoard);
            return savedBoard;
        },
        addNewCard({ commit }, { newCard, groupId }) {
            // state.currBoard.groups.forEach(group => {
            //     if (group.id === groupId) group.cards.push(newCard);
            // });
            // return boardService.save(state.currBoard)
            commit({type:'newCard', newCard, groupId})
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