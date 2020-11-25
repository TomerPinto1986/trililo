import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
        currBoard: null,
        currCard: null
    },
    getters: {
        boards(state) {
            return state.boards;
        },
        currCard(state) {
            return state.currCard
        }
    },
    mutations: {
        setBoards(state, boards) {
            state.boards = boards;
        },
        setCurrBoard(state, { board }) {
            state.currBoard = JSON.parse(JSON.stringify(board))
            console.log(state.currBoard)
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
        saveCard({ commit, dispatch }, { card }) {
            commit({ type: 'updateCurrCard', card });
            commit({ type: 'updateCurrBoard', card });
            dispatch({ type: 'updateBoard' })
        }
    },
}