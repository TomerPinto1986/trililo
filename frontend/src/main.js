import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router/routes.js';
import store from './store/store.js';
import '@/styles/styles.scss'



Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app')