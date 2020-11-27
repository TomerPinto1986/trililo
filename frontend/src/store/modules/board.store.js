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
            return JSON.parse(JSON.stringify(state.boards));
        },
        currBoard(state) {
            return state.currBoard;
        },
        currGroup(state) { //Maybe move to card-details cmp?
            console.log(state);
            const currGroup = state.currBoard.groups.find(group => group.cards.some(card => card.id === state.currCard.id));
            console.log(currGroup, 'got here');
            return currGroup;
        },
        emptyGroup(state) {
            return state.emptyGroup;
        }
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
        updateBoard(state, { board }) {
            console.log(board)
            state.currBoard = board;
        },
        setEmptyGroup(state) {
            const group = JSON.parse(JSON.stringify(boardService.emptyGroup()));
            console.log('group:', group)
            state.emptyGroup = group
        },
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)
        },
        async loadBoard({ commit }, { boardId }) {
            const board = await boardService.getById(boardId)
            commit({ type: 'updateBoard', board })
        },
        async updateBoard({ commit }, { board }) {
            commit({ type: 'updateBoard', board })
            return boardService.save(board);
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
    }
}