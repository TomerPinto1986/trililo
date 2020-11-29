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
            this.getters.currBoard.groups.forEach(group => {
                const card = group.cards.find(card => card.id === cardId);
                if (card) {
                    state.currCard = card;
                }
            })
        },
        updateCurrCard(state, { card }) {
            state.currCard = card;
        },
        setEmptyCard(state) {
            const card = JSON.parse(JSON.stringify(boardService.emptyCard()));
            console.log('card:', card)
            state.emptyCard = card
        },
        updateCardStatus(state, { status }) {
            console.log(status)
            if ((status.startGroup === status.endGroup && status.endPos === status.startPos) || (status.startGroup === status.endGroup && (!status.endPos && status.endPos !== 0))) return;
            console.log('moving');
            const board = this.getters.currBoard;
            const startGroupIdx = board.groups.findIndex(group => group.id === status.startGroup);
            board.groups[startGroupIdx].cards.splice(status.startPos, 1);
            const endGroupIdx = board.groups.findIndex(group => group.id === status.endGroup);
            if (!status.endPos && status.endPos !== 0) {
                board.groups[endGroupIdx].cards.push(state.currCard);
            } else board.groups[endGroupIdx].cards.splice(status.endPos, 0, state.currCard);
        },
    },
    actions: {}
}