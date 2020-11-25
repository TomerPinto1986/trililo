import httpService from './http.service';




export const boardService = {
    query,
    getById,
    remove,
    save,
};

function query() {
    return httpService.get('boards');
}

function getById(boardId) {
    return httpService.get(`boards/${boardId}`);
}

function remove(boardId) {
    return httpService.delete(`boards/${boardId}`);
}

function save(board) {
    if (board._id) {
        return httpService.put(`boards/${board._id}`, board);
    } else {
        return httpService.post(`boards`, board);
    }
}