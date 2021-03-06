// #ifdef H5
import WechatJSSDK from "@/plugin/jweixin-module/index.js";


import {
	getWechatConfig,
	wechatAuth
} from "@/api/public";
import {
	WX_AUTH,
	WX_APPID,
	STATE_KEY,
	LOGINTYPE,
	BACK_URL
} from '@/config/cache';
import {
	parseQuery
} from '@/utils';
import store from '@/store';
import Cache from '@/utils/cache';

class AuthWechat {

	constructor() {
		//微信实例化对象
		this.instance = WechatJSSDK;
		//是否实例化
		this.status = false;

		this.initConfig = {};

	}
	
	isAndroid(){
		let u = navigator.userAgent;
		return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
	}

	/**
	 * 初始化wechat(分享配置)
	 */
	wechat() {
		return new Promise((resolve, reject) => {
			// if (this.status && !this.isAndroid()) return resolve(this.instance);
			getWechatConfig()
				.then(res => {
					this.instance.config(res.data);
					this.initConfig = res.data;
					Cache.set(WX_APPID, res.data.appId || 0)
					this.status = true;
					this.instance.ready(() => {
						resolve(this.instance);
					})
				}).catch(err => {
					console.log(err);
					this.status = false;
					reject(err);
				});
		});
	}

	/**
	 * 验证是否初始化
	 */
	verifyInstance() {
		let that = this;
		return new Promise((resolve, reject) => {
			if (that.instance === null && !that.status) {
				that.wechat().then(res => {
					resolve(that.instance);
				}).catch(() => {
					return reject();
				})
			} else {
				return resolve(that.instance);
			}
		})
	}
	// 微信公众号的共享地址
	openAddress() {
		return new Promise((resolve, reject) => {
			this.wechat().then(wx => {
				this.toPromise(wx.openAddress).then(res => {
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			})
		});
	}

	/**
	 * 微信支付
	 * @param {Object} config
	 */
	pay(config) {
		//jweixin-module插件中时间戳字段为全小写 timestamp
		//支付签名时间戳，
		//NOTE: 注意微信jssdk中的所有使用timestamp字段均为小写。
		//但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
		config.timestamp = config.timeStamp;
		console.log('== lib wechat.js config ==', config);
		return new Promise((resolve, reject) => {
			this.wechat().then((wx) => {
				this.toPromise(wx.chooseWXPay, config).then(res => {
					
					resolve(res);
				}).catch(res => {
					uni.removeStorageSync('goPages');
					reject(res);
				});
			}).catch(res => {
				uni.removeStorageSync('goPages');
				reject(res);
			});
		});
	}

	toPromise(fn, config = {}) {
		return new Promise((resolve, reject) => {
			fn({
				...config,
				success(res) {
					resolve(res);
				},
				fail(err) {
					reject(err);
				},
				complete(err) {
					reject(err);
				},
				cancel(err) {
					reject(err);
				}
			});
		});
	}

	/**
	 * 自动去授权
	 */
	oAuth() {
		if (uni.getStorageSync(WX_AUTH) && store.state.app.token) return;
		const {
			code
		} = parseQuery();
		if (!code) return this.toAuth();
	}

	clearAuthStatus() {

	}

	/**
	 * 授权登陆获取token
	 * @param {Object} code
	 */
	auth(code) {
		return new Promise((resolve, reject) => {
			let loginType = Cache.get(LOGINTYPE);
			wechatAuth(code, parseInt(Cache.get("spread")), loginType)
				.then(({
					data
				}) => {
					let expires_time = data.expires_time.substring(0, 19);
					expires_time = expires_time.replace(/-/g, '/');
					expires_time = new Date(expires_time).getTime();
					let newTime = Math.round(new Date() / 1000);
					store.commit("LOGIN", {
						token: data.login_token,
						time: expires_time - newTime
					});
					Cache.set(WX_AUTH, code);
					Cache.clear(STATE_KEY);
					loginType && Cache.clear(LOGINTYPE);
					resolve();
				})
				.catch(reject);
		});
	}

	/**
	 * 获取跳转授权后的地址
	 * @param {Object} appId
	 */
	getAuthUrl(appId) {
		const redirect_uri = encodeURIComponent(
			`${location.origin}/pages/auth/index?back_url=` +
			encodeURIComponent(
				encodeURIComponent(
					uni.getStorageSync(BACK_URL) ?
					uni.getStorageSync(BACK_URL) :
					location.pathname + location.search
				)
			)
		);
		uni.removeStorageSync(BACK_URL);
		const state = encodeURIComponent(
			("" + Math.random()).split(".")[1] + "authorizestate"
		);
		uni.setStorageSync(STATE_KEY, state);
		return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
	}

	getJsApiCodeUrl(backurl)
	{
		let appId = uni.getStorageSync(WX_APPID);
		if(appId)
		{
		    let redirect_uri = encodeURIComponent(backurl);
		    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base#wechat_redirect`;
		}else
		{
		    //没有缓存则重新授权一遍
		    this.toAuth();

		}
	}
	/**
	 * 跳转自动登陆
	 */
	toAuth() {
		let that = this;
		this.wechat().then(wx => {
			location.href = this.getAuthUrl(that.initConfig.appId);
		})
	}

	/**
	 * 绑定事件
	 * @param {Object} name 事件名
	 * @param {Object} config 参数
	 */
	wechatEvevt(name, config) {
		let that = this;
		return new Promise((resolve, reject) => {
			let configDefault = {
				fail(res) {
					console.log(res,11111);
					if (that.instance) return reject({
						is_ready: true,
						wx: that.instance
					});
					that.verifyInstance().then(wx => {
						return reject({
							is_ready: true,
							wx: wx
						});
					})
				},
				success(res) {
					return resolve(res,2222);
				}
			};
			Object.assign(configDefault, config);
			that.wechat().then(wx => {
				if (typeof name === 'object') {
					name.forEach(item => {
						wx[item] && wx[item](configDefault)
					})
				} else {
					wx[name] && wx[name](configDefault)
				}
			})
		});
	}

	isWeixin() {
		return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
	}

}

export default new AuthWechat();
// #endif
