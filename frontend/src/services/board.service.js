import {httpService} from './http.service';
import { utilService } from './util.service';


export const boardService = {
    query,
    getById,
    remove,
    save,
    emptyCard,
<<<<<<< HEAD
    emptyBoard
=======
    emptyGroup
>>>>>>> 55b7e61705589e05e008eb22189ede642c0323c7
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

<<<<<<< HEAD
function emptyBoard() {
    return {
        "_id": '',
        "title": "",
        "byMember": {},
        "isPrivate": true,
        "style": {
            "background": "#eee"
        },
        "members": [],
        "groups": [
            {
                "id": utilService.makeId() + '',
                "title": "TODO",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            },
            {
                "id": utilService.makeId() + '',
                "title": "IN PROGRESS",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            },
            {
                "id": utilService.makeId() + '',
                "title": "DONE",
                "cards": [],
                "style": {
                    "headerColor": ""
                }
            }
        ],
        "activities": []
=======
function emptyGroup() {
    return {
        "id": utilService.makeId(),
        "title": "",
        "cards": [],
        "style": {
            "headerColor": "#ffffff"
        }
>>>>>>> 55b7e61705589e05e008eb22189ede642c0323c7
    }
}