import { boardService } from '../../services/board.service.js';
import { utilService } from '../../services/util.service.js'

export default {
    state: {
        boards: null,
        currBoard: null,
        emptyGroup: null,
        emptyActivity: null
    },
    getters: {
        boards(state) {
            return utilService.deepCopy(state.boards);
        },
        currBoard(state) {
            return state.currBoard;
        },
        emptyGroup(state) {
            return state.emptyGroup;
        },
        emptyActivity(state) {
            return state.emptyActivity
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
            const group = utilService.deepCopy(boardService.emptyGroup());
            state.emptyGroup = group;
        },
        setEmptyActivity(state) {
            const activity = utilService.deepCopy(boardService.emptyActivity());
            state.emptyActivity = activity;
        }
    },
    actions: {
        async loadBoards({ commit }) {
            const boards = await boardService.query()
            commit('setBoards', boards)
        },
        async loadBoard({ commit }, { boardId }) {
            let board;
            if (!boardId) board = null;
            else board = await boardService.getById(boardId)
            commit({ type: 'updateBoard', board })
        },
        async updateBoard({ commit }, { board }) {
            commit({ type: 'updateBoard', board })
            return await boardService.save(board);
        },
        async deleteBoard({ commit }, boardId) {
            console.log('adad')
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