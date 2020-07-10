import store from "../store";
import Cache from '../utils/cache';
import { SHOP_KEY } from './../config/cache';

export function setShopKey(key) {
    // 如果是url中带shop_key,且与本地不一致，则更新本地SHOP_KEy
    if (key !== undefined && key.length>10) {
	var LastShopKey = Cache.get(SHOP_KEY);
	if (LastShopKey !== key ) {
		Cache.set(SHOP_KEY, key || 0);
		store.commit('UPDATE_SHOP_KEY',key);
		console.log("set shop key:",key);
	}
    }else
    {
	var LastShopKey = Cache.get(SHOP_KEY);
	//console.log(LastShopKey);
	// 既没有参数，也没有缓存，则默认shop_key
	if(LastShopKey === undefined)
	{
		Cache.set(SHOP_KEY, 'e6948c206d911463dfcdccf929e09485' || 0);
	}
    }
}


export function getShopKey()
{
    let shop_key = "";
    if (store.state.app.shopKey) {
	shop_key = encodeURIComponent(store.state.app.shopKey);
    }else{
	shop_key = encodeURIComponent('e6948c206d911463dfcdccf929e09485');
    }
    return shop_key;
}
