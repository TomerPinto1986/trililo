import { boardService } from '../../services/board.service.js';

export default {
    state: {
        boards: null,
        currBoard: null,
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
            state.currBoard = board;
        },
        setEmptyGroup(state) {
            const group = JSON.parse(JSON.stringify(boardService.emptyGroup()));
            state.emptyGroup = group;
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
            const user = context.getters.loggedinUser;
            newBoard.title = newBoardTxt;
            if (user._id === 'guest') newBoard.isPrivate = false;
            else {
                newBoard.byMember = user;
                newBoard.members.push(user);
            }
            const activity = boardService.emptyActivity();
            activity.byMember = user;
            activity.createdAt = Date.now();
            activity.txt = 'created the board';
            delete activity.card;
            newBoard.activities.push(activity);
            const savedBoard = await boardService.save(newBoard);
            context.commit('addNewBoard', savedBoard);
            return savedBoard;
        },
    }
}