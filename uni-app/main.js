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


console.log(urlShopKey);
    // 如果是url中带shop_key,且与本地不一致，则更新本地SHOP_KEy
if (urlShopKey !== undefined) {
	var LastShopKey = Cache.get(SHOP_KEY);
	console.log(LastShopKey);
	//urlShopKey = parseInt(urlShopKey);
	if (LastShopKey !== urlShopKey) {
		//console.log('set shop_key');
		Cache.set(SHOP_KEY, urlShopKey || 0);
	} 
}else
{
	var LastShopKey = Cache.get(SHOP_KEY);
	// 既没有参数，也没有缓存，则默认shop_key=0
	if(LastShopKey === null)
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
