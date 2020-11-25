import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
        currBoard: null,
        currCard: null,
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
        emptyCard() {
            return boardService.emptyCard();
        },
    },
    mutations: {
        setBoards(state, boards) {
            state.boards = boards;
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
        getEmptyCard(state) {
            console.log('getting from store')
            const card = JSON.parse(JSON.stringify(boardService.emptyCard()));
            state.emptyCard = card
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)
        },
        async updateBoard({ state }) {
            await boardService.save(state.currBoard)
        },
        async getBoardById({ commit, state }, { boardId }) {
            const board = await boardService.getById(boardId)
            commit({ type: 'setCurrBoard', board })
            console.log(state.currBoard)
            return state.currBoard;
        },
        // async deleteBoard({ commit }) {

        // },
        addNewCard({ state }, { newCard, groupId }) {
            state.currBoard.groups.forEach(group => {
                if (group.id === groupId) group.cards.push(newCard);
            });
            boardService.save(state.currBoard)
            return state.currBoard
        },
        deleteCard({ state }, { cardId }) {
            state.currBoard.groups.forEach(group => {
                const cardIdx = group.cards.findIndex(card => card.id === cardId);
                if (cardIdx !== -1) group.cards.splice(cardIdx, 1);
            });
            return boardService.save(state.currBoard)
        }
    },
}