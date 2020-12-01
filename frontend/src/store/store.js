import userStore from './modules/user.store';
import boardStore from './modules/board.store';
import cardStore from './modules/card.store';
import Vue from 'vue';
import Vuex from 'vuex';
import bg1 from '../assets/bgs/bg1.jpg';
import bg2 from '../assets/bgs/bg2.jpg';
import bg3 from '../assets/bgs/bg3.jpg';
import bg4 from '../assets/bgs/bg4.jpg';
import bg5 from '../assets/bgs/bg5.jpg';
import bg6 from '../assets/bgs/bg6.jpg';


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        bgc: 'rgb(165 177 182)',
        bgSrcs: [bg1, bg2, bg3, bg4, bg5, bg6],

    },
    getters: {
        bgc(state) {
            return state.bgc;
        },
        bgSrcs(state) {
            return state.bgSrcs;
        }
    },
    mutations: {   
        loadBgc(state) {
            const board = this.getters.currBoard;
            const bgc = (board) ? board.style.background : 'rgb(165 177 182)';
            const style = (bgc.includes('rgb')) ? bgc : `url(${state.bgSrcs[+bgc]})`;
            state.bgc = style;
        },
        bgChange(state, { bgc }) {
            const style = (bgc.includes('rgb')) ? bgc : `url(${state.bgSrcs[+bgc]})`;
            state.bgc = style;
        }
    },
    actions: {},
    modules: {
        boardStore,
        userStore,
        cardStore
    }
})