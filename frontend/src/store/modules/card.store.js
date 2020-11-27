import { boardService } from '../../services/board.service.js';

export default {
    state: {
        currCard: null,
        emptyCard: null,
    },
    getters: {
        currCard(state) {
            return state.currCard;
        },
        emptyCard(state) {
            return state.emptyCard;
        },
        activities(state) {
            return state.currCard.activities;
        },
    },
    mutations: {
        setCurrCard(state, { cardId }) {
            console.log(this.getters)
            this.getters.currBoard.groups.forEach(group => {
                const card = group.cards.find(card => card.id === cardId);
                if (card) {
                    state.currCard = card;
                }
            })
        },
        updateCurrCard(state, { card }) {
            console.log(card)
            state.currCard = card;
        },
        setEmptyCard(state) {
            const card = JSON.parse(JSON.stringify(boardService.emptyCard()));
            console.log('card:', card)
            state.emptyCard = card
        },
        updateCardStatus(state, { status }) {
            if ((status.startGroup === status.endGroup || !status.endGroup) &&
                (status.startPos === status.endPos || !status.endPos)) {
                return
            }
            const board = this.getters.currBoard;
            const startGroupIdx = board.groups.findIndex(group => group.id === status.startGroup)
            board.groups[startGroupIdx].cards.splice(status.startPos, 1);
            if (!status.endGroup) {
                board.groups[startGroupIdx].cards.splice(status.endPos, 0, state.currCard);
            } else {
                const endGroupIdx = board.groups.findIndex(group => group.id === status.endGroup);
                if (!status.endPos) {
                    board.groups[endGroupIdx].cards.push(state.currCard);
                    return
                }
                board.groups[endGroupIdx].cards.splice(status.endPos, 0, state.currCard);
            }
        },
    },
    actions: {}
}