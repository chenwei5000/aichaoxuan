import Vue from 'vue'
import App from './App'
import store from './store'
import Cache from './utils/cache'
import util from 'utils/util'

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


//console.log(urlShopKey);
// 如果是url中带shop_key,且与本地不一致，则更新本地SHOP_KEy
if (urlShopKey !== undefined && urlShopKey.length>10) {
	var LastShopKey = Cache.get(SHOP_KEY);
	if (LastShopKey !== urlShopKey ) {
		Cache.set(SHOP_KEY, urlShopKey || 0);
	} 
}else
{
	var LastShopKey = Cache.get(SHOP_KEY);
	//console.log(LastShopKey);
	// 既没有参数，也没有缓存，则默认shop_key
	if(LastShopKey === undefined)
	{
		Cache.set(SHOP_KEY, '5pSMIG2RFGPfzcz5KeCUhQ==' || 0);
	}
}


Auth.isWeixin() && Auth.oAuth();

// #endif

App.mpType = 'app'


const app = new Vue({
    ...App,
	store,
	Cache
})
app.$mount();
