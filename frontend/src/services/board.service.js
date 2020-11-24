import httpService from './http.service';




export const boardService = {
    query,
    getById,
    remove,
    save,
};

function query() {
    return httpService.get('board');
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`);
}

function remove(boardId) {
    return httpService.delete(`board/${boardId}`);
}

function save(board) {
    if (board._id) {
        return httpService.put(`board/${board._id}`, board);
    } else {
        return httpService.post(`board`, board);
    }
}