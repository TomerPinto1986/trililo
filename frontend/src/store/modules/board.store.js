import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
        currBoard: null,
        currCard: null
    },
    getters: {
        boards(state) {
            console.log(state.boards);
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
        updateCurrBoard(state, { board }) {
            state.currBoard = JSON.parse(JSON.stringify(board))
            console.log(state.currBoard)
        },
        updateCurrCard(state, { cardId }) {
            state.currBoard.groups.forEach(group => {
                const card = group.cards.find(card => card.id === cardId)
                if (card) {
                    console.log(card)
                    state.currCard = card
                }
            })
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)
        }
    },
}