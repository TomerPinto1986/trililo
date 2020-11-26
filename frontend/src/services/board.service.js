import { httpService } from './http.service';
import { utilService } from './util.service';


export const boardService = {
    query,
    getById,
    remove,
    save,
    emptyCard,
    emptyBoard,
    emptyGroup
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

function emptyBoard() {
    return {
        "title": "",
        "byMember": {},
        "isPrivate": true,
        "style": {
            "background": "#eee"
        },
        "members": [],
        "groups": [{
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