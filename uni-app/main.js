import Vue from 'vue'
import App from './App'
import store from './store'
import Cache from './utils/cache'
import util from 'utils/util'
import { setShopKey } from './libs/public.js'
import { getShopKey } from './libs/public.js'
import './static/iconfont/fonts/iconfont.css'
Vue.prototype.$util = util;
Vue.prototype.$Cache = Cache;
Vue.prototype.$eventHub = new Vue();
Vue.config.productionTip = false

// #ifdef H5
import { parseQuery } from "./utils";
import Auth from './libs/wechat';
import { SHOP_KEY } from './config/cache';
Vue.prototype.$wechat = Auth;
let query = parseQuery(),
urlShopKey = query["shop_key"];
console.log("url shopKey:",urlShopKey);
setShopKey(urlShopKey);

Auth.isWeixin() && Auth.oAuth();

// #endif

App.mpType = 'app'


const app = new Vue({
    ...App,
	store,
	Cache
})
app.$mount();
