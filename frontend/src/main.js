import Vue from 'vue';
import app from './app.vue';
import './registerServiceWorker';
import router from './router/routes.js';
import store from './store/store.js';
import '@/styles/styles.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(app)
}).$mount('#app')