import {httpService} from './http.service';
import { utilService } from './util.service';


export const boardService = {
    query,
    getById,
    remove,
    save,
    emptyCard,
    emptyGroup
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
    console.log(board)
    if (board._id) {
        return httpService.put(`boards/${board._id}`, board);
    } else {
        board.createdAt = Date.now();
        return httpService.post(`boards`, board);
    }
}

function emptyCard() {
    return {
        "id": utilService.makeId(),
        "title": "",
        "description": "",
        "createdAt": "",
        "byMember": "",
        "style": {
            "headerColor": "#ffffff"
        }
    }
}

function emptyGroup() {
    return {
        "id": utilService.makeId(),
        "title": "",
        "cards": [],
        "style": {
            "headerColor": "#ffffff"
        }
    }
}