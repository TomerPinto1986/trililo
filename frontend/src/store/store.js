import userStore from './modules/user.store';
import boardStore from './modules/board.store';
import labelStore from './modules/label.store';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        boardStore,
        userStore,
        labelStore
    }
})