import httpService from './http.service';
import { utilService } from './util.service'




export const boardService = {
    query,
    getById,
    remove,
    save,
    emptyCard
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

function emptyCard() {
    console.log('Service')
    return {
        "id": utilService.makeId(),
        "title": "",
        "description": "",
        "createdAt": Date.now(),
        "byMember": "",
        "style": {
            "headerColor": "#ffffff"
        }
    }
}