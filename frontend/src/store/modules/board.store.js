import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
    },
    getters: {
        boards(state) {
            console.log(state.boards);
            return state.boards;
        }
    },
    mutations: {
        setBoards(state, boards) {
            state.boards = boards;
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)

        }
    },
}