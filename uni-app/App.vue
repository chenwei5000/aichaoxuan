
<script>
	// #ifdef MP
	let livePlayer = requirePlugin('live-player-plugin');
	import { getMiniappShareInfo } from './api/public';
	// #endif
	import { 
		setShopKey
	} from 'libs/public.js';
	import { checkLogin } from "./libs/login";
	import { HTTP_REQUEST_URL } from './config/app';
	import Cache from './utils/cache'
	import { SHOP_KEY } from './config/cache';
	export default {
		globalData: {
			spid: 0,
			pid: 0,
			shopKey:'',
			code:0,
			isLogin:false,
			userInfo:{},
			MyMenus:[]
		 },

		onLaunch: function(option) {
			console.log('this is on Launch');
			let that = this;
			// #ifdef MP
			let urlShopKey = option.query.shop_key;
			setShopKey(urlShopKey);
			console.log('shopKey from url:',urlShopKey);
			
			 if (HTTP_REQUEST_URL==''){
			      console.error("请配置根目录下的config.js文件中的 'HTTP_REQUEST_URL'\n\n请修改开发者工具中【详情】->【AppID】改为自己的Appid\n\n请前往后台【小程序】->【小程序配置】填写自己的 appId and AppSecret");
			      return false;
			    }
			console.log("enter scene",option.scene);
			 if (option.query.hasOwnProperty('scene')){
			      switch (option.scene) {
			        //扫描小程序码
			        case 1047:
			          //break;
			        //长按图片识别小程序码
			        case 1048:
			          //break;
			        //手机相册选取小程序码
			        case 1049:
			          //break;
			        //直接进入小程序
			        case 1001:
						getMiniappShareInfo(decodeURIComponent(option.query.scene)).then(res => {
							console.log(res);
							if(res.data.shop_key) setShopKey(res.data.shop_key);
							if(res.data.goods_id) that.globalData.pid = res.data.goods_id;
						});
						break;
			      }
			    }
				// #endif
			// 获取导航高度；
			uni.getSystemInfo({
			    success: function (res) {
					that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91;
			    }
			});
		},
		mounted() {
		},
		onShow(options) {
		    //console.log('on show');
			// #ifdef MP	
			// 如果参数中有shop_key则重新设置shop_key
			console.log('on show options:',options);
			if(options.query.shop_key)
			{
				let urlShopKey = options.query.shop_key;
				setShopKey(urlShopKey);
				console.log('shopKey from url:',urlShopKey);
			}

		    // 分享卡片入口场景才调用getShareParams接口获取以下参数
			console.log(options.scene == 1007 || options.scene == 1008 || options.scene == 1044);
		    if (options.scene == 1007 || options.scene == 1008 || options.scene == 1044) {
		        livePlayer.getShareParams()
		            .then(res => {
		                console.log('get room id', res.room_id) // 房间号
		                console.log('get openid', res.openid) // 用户openid
		                console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
		                console.log('get custom params', res.custom_params) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
						// 取到分享自定义参数里的shop_key,设置好，如果没有带，则用默认shop_key
						let urlShopKey = decodeURIComponent(res.custom_params.shop_key);
						console.log('分享直播的店铺Key:',urlShopKey);
						setShopKey(urlShopKey);
		            }).catch(err => {
		                console.log('get share params', err)
		            })
		    }
			// #endif
		  },
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style>
	@import url("@/plugin/animate/animate.min.css");
	@import 'static/css/base.css';
	@import 'static/iconfont/iconfont.css';
	@import 'static/css/guildford.css';
	@import 'static/css/style.scss';
	view{
		box-sizing: border-box;
	}
	.bg-color-red {
	  background-color: #e93323!important;
	}
	.syspadding{
		padding-top: var(--status-bar-height);
	}
	.flex{
		display: flex;
	}
	.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
</style>
