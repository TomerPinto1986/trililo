import userStore from './modules/user.store';
import boardStore from './modules/board.store';
<<<<<<< HEAD
import labelStore from './modules/label.store';
=======
import cardStore from './modules/card.store';
>>>>>>> 024c95ced93e27479cbfffbf353acd96643e1fc2
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
<<<<<<< HEAD
        labelStore
=======
        cardStore
>>>>>>> 024c95ced93e27479cbfffbf353acd96643e1fc2
    }
})