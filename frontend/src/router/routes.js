import Vue from 'vue';
import VueRouter from 'vue-router';
import homePage from '../views/home-page';
import boardList from '../views/board-list';
import boardDetails from '../views/board-details';
import cardDetails from '../views/card-details';
import cardList from '../cmps/card/card-list.cmp';
import login from '../views/login';

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'home',
    component: homePage
},
{
    path: '/board',
    name: 'board-list',
    component: boardList
},
{
    path: '/board/:boardId',
    name: 'board-details',
    component: boardDetails,
    alias: ['/board/:boardId/card/:cardId'],
    children: [{
        path: '/card/:cardId',
        name: 'card-details',
        component: cardDetails
    },]
},
{
    path: '/card',
    name: 'card-list',
    component: cardList
},
{
    path: '/login',
    name: 'login',
    component: login
},
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router