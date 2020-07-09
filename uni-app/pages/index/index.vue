<template>
	<view class="page-index" :class="{'bgf':navIndex >0}">
		<!-- 1.0 Header 部分 -->
		<Header 
			:shopInfo="shopName"
			:config="headerConfig" 
			@searchHeigth="headerHeight" 
			@hasTab="changeTab"
			@openMask="openMask">
		</Header>
		
		<!-- 2.0 首页展示 -->
		<!-- #ifdef H5 -->
			<view class="page_content" :style="'position: relative; top: '+ scrollHeight +'px;'" v-if="navIndex == 0">
		<!-- #endif -->
		<!-- #ifdef MP -->
			<view class="page_content" :style="'padding-top: '+ prodeuctTop +'px !important;'" v-if="navIndex == 0">
		<!-- #endif -->
			<view class="swiper">
				<swiper 
					indicator-dots="true" 
					:autoplay="true" 
					:circular="circular" 
					:interval="interval" 
					:duration="duration"
					indicator-color="rgba(255,255,255,0.6)" 
					indicator-active-color="#fff">
					<block v-for="(item,index) in imgUrls" :key="index">
						<swiper-item>
							<navigator :url='item.url' class='slide-navigator acea-row row-between-wrapper' hover-class='none'>
								<image :src="item.pic" class="slide-image"></image>
							</navigator>
						</swiper-item>
					</block>
				</swiper>
			</view>
			<!-- 直播 -->
			<!-- #ifdef MP -->
			<block v-if="liveList.length>0">
			<view style="width: 750rpx;background-color: #fff;margin-top: 20rpx;">
				<view style="width: 718rpx;height: 70rpx;display: flex;align-items: center;justify-content: space-between;">
					<view style="width: 320rpx;height: 70rpx;">
						<image src="../../static/images/lives.png" style="width: 100%; height: 100%;" mode=""></image>
					</view>
					<navigator url="../live/live">
					<view style="height: 70rpx;display: flex;align-items: center;">
						<text style="font-size:24rpx;color:rgba(255,2,5,1);">全部直播</text>
						<image style="width: 12rpx;height: 20rpx;margin-left: 26rpx;" src="../../static/images/livemore.png"></image>
					</view>
					</navigator>
				</view>
				
				<!-- 直播列表 -->
				<view class="live-content">
					<view class="lives-list" v-for="item in liveList" :key="item.id">
						
						<navigator :url="liveUrl + item.roomid + '&custom_params=' + LiveCustomParams">
							<view class="live-item">
								<view class="item-left">
									<view class="tips">
										<view class="tips-left">
											<text v-if="item.live_status === '101'">直播中 {{ item.status }}</text>
											<text v-else-if="item.live_status === '102'">直播预告</text>
											<text v-else>精彩回放</text>
										</view>
									</view>
									<view class="like">
										<text class="join-live" v-if="item.live_status === '101'">进入直播</text>
										<text class="join-live" v-else-if="item.live_status === '102'">订阅直播</text>
										<text class="join-live" v-else>点击回放</text>
									</view>
									<image :src="item.share_img" mode=""></image>
								</view>
								<view class="item-right">
									<text>{{ item.name }}</text>
									<view>
										<!-- start_time -->
										<view>
											<image :src="item.cover_img" mode=""></image>
										</view>
										<text>{{ item.anchor_name }}</text>
									</view>
									<view class="item-pro">
										<view>
											<text>￥{{ item.goods[0].price }}</text>
											<image :src="item.goods[0].cover_img" mode=""></image>
										</view>
										<view v-if="item.goods.length >= 2">
											<view class="mask-view">
												<text>{{ item.goods.length }}</text>
												<text>宝贝</text>
											</view>
											<image :src="item.goods[0].cover_img" mode=""></image>
										</view>
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>

			</block>
			<!-- #endif -->
			<!-- 限时秒杀 -->
			<view class="spike-box" v-if="spikeList.length>0">
				<view class="hd">
					<view class="left">
						<image src="/static/images/spike-icon-002.gif" class="icon"></image>
						<image src="/static/images/spike-icon-001.png" class="title"></image>
						<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '"
						 :datatime="datatime"></countDown>
					</view>
					<navigator class="more" url="/pages/activity/goods_seckill/index">更多 <text class="iconfont icon-jiantou"
						 hover-class='none'></text></navigator>
				</view>
				<view class="spike-wrapper">
					<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
						<navigator class="spike-item" v-for="(item,index) in spikeList" :key="index" :url="'/pages/activity/goods_seckill_details/index?id='+item.id+'&time='+datatime+'&status=1'"
						 hover-class='none'>
							<view class="img-box">
								<image :src="item.image" mode=""></image>
								<view class="msg flex-aj-center">{{item.discountNum}}折起</view>
							</view>
							<view class="info">
								<view class="name line1">{{item.title}}</view>
								<view class="price-box">
									<text class="tips">抢</text>
									<text class="price"><text>￥</text>{{item.price}}</text>
								</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</view>
			<view style="width: 750rpx;display: flex;justify-content: center;margin-top: 40rpx;">
				<image style="width: 474rpx;height: 40rpx;" src="../../static/images/shoprecomm.png"></image>
			</view>
			<!-- 首页推荐 -->
			<view class="index-product-wrapper">
				<!-- 首发新品 -->
				<view class="list-box animated" :class='tempArr.length > 0?"fadeIn on":""'>
					<view class="item" v-for="(item,index) in tempArr" :key="index" @click="goDetail(item)">
						<view class="pictrue">
							<span class="pictrue_log pictrue_log_class" v-if="item.activity && item.activity.type === '1'">秒杀</span>
							<span class="pictrue_log pictrue_log_class" v-if="item.activity && item.activity.type === '2'">砍价</span>
							<span class="pictrue_log pictrue_log_class" v-if="item.activity && item.activity.type === '3'">拼团</span>
							<image :src="item.image" mode=""></image>
						</view>
						<view class="text-info">
							<view class="title line1">{{item.store_name}}</view>
							<view class="price">
								￥{{item.price}}
								<!-- <text style="margin-left: 16rpx;">零￥{{item.price}}</text> -->
								<!-- <view class="txt" v-if="item.checkCoupon">券</view> -->
							</view>
						</view>
					</view>
				</view>
				<view class='loadingicon acea-row row-center-wrapper' v-if="goodScroll">
					<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
				</view>
				<view class="mores-txt flex" v-if="!goodScroll">
					<text>我是有底线的</text>
				</view>
			</view>
		</view>
		<!-- 分类页 -->
		<view class="productList" v-if="navIndex>0" :style="'padding-top: '+ prodeuctTop +'px;'">
			<block v-if="sortProduct.length>0">
				<view class='list acea-row row-between-wrapper' :class='is_switch==true?"":"on"'>
					<view class='item' :class='is_switch==true?"":"on"' hover-class='none' v-for="(item,index) in sortProduct" :key="index"
					 @click="godDetail(item)">
						<view class='pictrue' :class='is_switch==true?"":"on"'>
							<image :src='item.image' :class='is_switch==true?"":"on"'></image>
							<span class="pictrue_log_class" :class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'" v-if="item.activity && item.activity.type === '1'">秒杀</span>
							<span class="pictrue_log_class" :class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'" v-if="item.activity && item.activity.type === '2'">砍价</span>
							<span class="pictrue_log_class" :class="is_switch === true ? 'pictrue_log_big' : 'pictrue_log'" v-if="item.activity && item.activity.type === '3'">拼团</span>
						</view>
						<view class='text' :class='is_switch==true?"":"on"'>
							<view class='name line1'>{{item.store_name}}</view>
							<view class='money font-color' :class='is_switch==true?"":"on"'>￥<text class='num'>{{item.price}}</text></view>
							<view class='vip acea-row row-between-wrapper' :class='is_switch==true?"":"on"'>
							</view>
						</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper' v-if='sortProduct.length > 0'>
						<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
					</view>
				</view>
			</block>
			<block v-if="sortProduct.length == 0">
				<view class="noCommodity">
					<view class='pictrue'>
						<image src='/static/images/noShopper.png'></image>
					</view>
					<recommend :hostProduct="hostProduct"></recommend>
				</view>

			</block>
		</view>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse" :isGoIndex="false"></authorize>
		<!-- #endif -->
		<view class="floatright">
			<image src="/static/images/minishare.png" @tap="open('mini')"></image>
		</view>
		<uni-popup ref="showmini" type="center">
			<image style="width: 400rpx;height: 400rpx;" :src="wxa_code_image"></image>
		</uni-popup>
		<uni-popup ref="showset" :mask-click="true">
			<view class="shop-mask" >
				<icon class="close-mask" @click="closeMask" type="clear" size="22"/>
				<view class="mask-head">
					<view><image :src="shopName.shopAvatar"></image></view>
					<text>{{ shopName.shopName }}</text>
				</view>
				<view class="wechat-code">
					<image :src="shopName.shopWechatBarcode"></image>
				</view>
				<text class="tips"> 截图保存二维码 </text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	let app = getApp();
	import { getIndexData } from '@/api/api.js';
	// #ifdef MP-WEIXIN
	import {
		getTemlIds,
		getLiveLists
	} from '@/api/api.js';
	import {
		SUBSCRIBE_MESSAGE,
		SHOP_KEY,
		TIPS_KEY
	} from '@/config/cache';
	// #endif
	// #ifdef H5  
	import {
		getShare,
		follow
	} from '@/api/public.js';
	// #endif
	import { 
		getShopKey
	} from '../../libs/public.js'
	import goodList from '@/components/goodList';
	import promotionGood from '@/components/promotionGood';
	import { goShopDetail } from '@/libs/order.js'
	import { mapGetters } from "vuex";
	import countDown from '@/components/countDown';
	import {
		getCategoryList,
		getProductslist,
		getProductHot,
		getIndexProductList,
		getWechatShareInfo
	} from '@/api/store.js';
	import {
		setVisit
	} from '@/api/user.js'
	import recommend from '@/components/recommend';
	// #ifdef MP
	import authorize from '@/components/Authorize';
	import store from '@/store';
	import Cache from '@/utils/cache'
	// #endif	
	// import uniPopup from "@/components/uni-popup/uni-popup"
	import Header from './Header.vue'
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			Header,
			goodList,
			promotionGood,
			countDown,
			recommend,
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				loading: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				liveUrl: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=',
				LiveCustomParams:"",
				navIndex: 0,
				subscribe: false,
				followUrl: "",
				followHid: true,
				followCode: false,
				imgUrls: [],
				itemNew: [],
				activityList: [],
				menus: [],
				bastBanner: [],
				bastInfo: '',
				bastList: [],
				fastInfo: '',
				fastList: [],
				firstInfo: '',
				firstList: [],
				salesInfo: '',
				likeInfo: [],
				benefit: [],
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				window: false,
				iShidden: false,
				navH: "",
				newGoodsBananr: '',
				couponList: [],
				lovely: [],
				liveList: [],
				spikeList: [],
				combinationList: [],
				hotList: [],
				bargList: [],
				ProductNavindex: 0,
				marTop: 0,
				datatime: 0,
				childID: 0,
				loadend: false,
				loadTitle: '加载更多',
				sortProduct: [],
				where: {
					sid: 0,
					page: 1,
					limit: 20,
				},
				is_switch: true,
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				explosiveMoney: [],
				prodeuctTop: 0,
				pinkInfo: '',
				searchH: 0,
				goodType: 0, //精品推荐Type
				goodScroll: true, //精品推荐开关
				params: { 
				    //精品推荐分页
					page: 1,
					limit: 10,
				},
				tempArr: [], //精品推荐临时数组
				shopName: {} ,//首页title
				scrollHeight: 0,
				// Header 配置
				headerConfig: {
					navTop: [],
					isFixed: false,
				},
				wxa_code_image:''
			}
		},
		onLoad() {
			// #ifndef MP
			this.navH = 0;
			if(options.scene)
			{
				let sceneResult = await this.decodeScene(options.scene);
				sceneResult.then(res => {
					console.log("get Api resutl ",res);
					if(res.data.shop_key) setShopKey(res.data.shop_key);
				  });
			}
			console.log("after decode");
			// #endif
						
			Promise.all([ this.getAllCategory(), this.getIndexConfig(), this.setVisit() ])
			
			// #ifdef MP
			let shop_key="";
			shop_key = getShopKey();
			this.LiveCustomParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', shop_key: shop_key }))
			this.getLiveList()
			// #endif
			this.getWechatShareInfo()
		},
		onShow() {
			let self = this
			uni.setNavigationBarTitle({
				title: self.shopName
			})			 
		},
		methods: {
			async decodeScene(scene){
				return getMiniappShareInfo(decodeURIComponent(scene));
			},
			// 记录会员访问
			setVisit() {
				setVisit({
					url: '/pages/index/index'
				}).then(res => {
					// console.log(res)
				})
			},
			//分类产品
			get_product_list: function(isPage) {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				// if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				getProductslist(that.where).then(res => {
					if (that.where.page == 1 && res.data.length == 0) {
						that.hotScroll = false
						that.hotPage = 1
						that.hostProduct = []
						this.get_host_product()
					}
					
					// 修改，无 2 级分类，直接切换了内容
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.sortProduct);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'sortProduct', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				that.loading = true;

				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data)
					// that.$set(that, 'hostProduct', res.data)
				});
			},

			// 首页数据
			getIndexConfig: function() {
				let that = this;
				getIndexData().then(res => {
					uni.setNavigationBarTitle({
						title: res.data.shopName
					})
					that.$set(that, "shopName", res.data);
					that.$set(that, "imgUrls", res.data.banner);
					
					// #ifdef H5
					that.subscribe = res.data.subscribe;
					that.setOpenShare();
					// #endif
					// 小程序判断用户是否授权；
					// #ifdef MP
					uni.getSetting({
						success(res) {
							if (!res.authSetting['scope.userInfo']) {
								that.window = that.couponList.length ? true : false;
							} else {
								that.window = false;
								that.iShidden = true;
							}
						}
					});
					// #endif
					// #ifndef MP
					if (that.isLogin) {
						that.window = false;
					} else {
						that.window = that.couponList.length ? true : false;
					}
					// #endif
					this.getIndexProductList();
				})
			},
			
			// 获取导航
			getAllCategory: function() {
				let that = this;
				getCategoryList().then(res => {
					res.data.unshift({
						'cate_name': '首页'
					})
					that.headerConfig.navTop = res.data
				})
			},
			// 导航分类切换
			changeTab(e) {
				let self = this
				if (e.type == 'big') {
					if (e.index == 0) {
						this.navIndex = e.index
					} else {
						// #ifdef H5
						self.prodeuctTop = 18
						// #endif
						this.navIndex = e.index
						if (this.headerConfig.navTop[e.index].children.length > 0) {
							this.where.sid = this.headerConfig.navTop[e.index].children[0].id
						} else {
							this.where.sid = this.headerConfig.navTop[e.index].id
						}
						this.loadend = false
						this.loading = false
						this.where.page = 1
						this.sortProduct = []
						this.get_product_list()
					}
				} else {
					this.navIndex = e.parentIndex
					this.where.sid = this.headerConfig.navTop[e.parentIndex].children[e.childIndex].id
					this.loadend = false
					this.loading = false
					this.where.page = 1
					this.sortProduct = []
					this.get_product_list()
				}
			},
			
			// 获取高度
			headerHeight(num, num1) {
				this.searchH = num
				this.prodeuctTop = num1
			},
			
			// 打开面板
			openMask() {
				this.$refs.showset.open()
			},
			
			closeMask() {
				this.$refs.showset.close()
			},
			
			// 微信分享；
			setOpenShare: function() {
				let that = this;
				if (that.$wechat.isWeixin()) {
					getShare().then(res => {
						let data = res.data.data;
						let configAppMessage = {
							desc: data.synopsis,
							title: data.title,
							link: location.href,
							imgUrl: data.img
						};
						that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"], configAppMessage);
					})
				}
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 授权回调
			onLoadFun() {

			},
			// 首发新品切换
			ProductNavTab(item, index) {
				this.goodType = item.type
				this.ProductNavindex = index
				this.tempArr = []
				this.params.page = 1
				this.goodScroll = true
				this.getIndexProductList()
			},
			// 首发新品详情
			goDetail(item) {
				if (item.activity && item.activity.type === "2" && !this.isLogin) {
					// #ifdef H5
					uni.showModal({
						title: '提示',
						content: '您未登陆，请登陆！',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/users/login/index'
								})
							} else if (res.cancel) {}
						}
					})
					// #endif
					// #ifdef MP
					this.$set(this, 'isAuto', true);
					this.$set(this, 'isShowAuth', true);
					// #endif
					return
				} else {
					goShopDetail(item, this.uid).then(res => {
						uni.navigateTo({
							url: `/pages/goods_details/index?id=${item.id}`
						})
					})
				}
			},
			// 分类详情
			godDetail(item) {
				goShopDetail(item, this.uid).then(res => {
					uni.navigateTo({
						url: `/pages/goods_details/index?id=${item.id}`
					})
				})
			},
			// 直播
			getLiveList: function() {
				getLiveLists(1, 20).then(res => {
					this.liveList = res.data.live_list
				}).catch(res => {

				})
			},
			// 店铺商品推荐
			getIndexProductList() {
				this.loading = true
				if (!this.goodScroll) return
				getIndexProductList(this.params).then(({
					data
				}) => {
					this.loading = false
					this.goodScroll = data.list.length >= this.params.limit
					this.params.page++
					this.tempArr = this.tempArr.concat(data.list)
				})
			},
			getWechatShareInfo: function() {
				let that = this;
				getWechatShareInfo(0).then(res => {
					that.wxa_code_image = res.data.wxa.wxa_code_image;
				});
			},
			open(type) {
				this.$refs['show' + type].open()
			},
			cancel(type) {
				this.$refs['show' + type].close()
			},
		},
		// 滚动到底部
		onReachBottom() {

			if (this.navIndex == 0) {
				// 首页加载更多
				if (this.params.page != 1) {
					this.getIndexProductList();
				}
			} else {
				// 分类栏目加载更多
				if (this.sortProduct.length > 0) {
					this.get_product_list();
				} else {
					this.get_host_product();
				}
			}
		},
		
		// 滚动监听
		onPageScroll(e) {
			let self = this
			
			if (e.scrollTop >= this.searchH) {
				self.headerConfig.isFixed = true
				
				// #ifdef H5
				// 设置距离
				let tabNav = uni.createSelectorQuery().select(".tabNav");
				let pageContent = uni.createSelectorQuery().select(".page-content");
				tabNav.boundingClientRect(function(data) {
					self.scrollHeight = data.height
					
				}).exec()
				// #endif
			} else {
				self.headerConfig.isFixed = false
				self.scrollHeight = 0
			}
		}
	}
</script>
<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss">
	/deep/.spike-box .styleAll {
		display: inline-block;
		width: 44rpx;
		height: 40rpx;
		line-height: 40rpx;
		padding: 0;
		text-align: center;
		border-radius: 8rpx;
	}
	
	// 联系店主的遮罩
	.shop-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 528rpx;
		height: 704rpx;
		background-color: #fff;
		transform: translate(-50%, -35%);
		overflow: hidden;
		
		.close-mask {
			position: absolute;
			top: 32rpx;
			right: 32rpx;
		}
		
		.mask-head {
			padding: 58rpx 32rpx 0;
			overflow: hidden;
			
			view {
				float: left;
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				border: 1px solid #d8d8d8;
				box-sizing: border-box;
				margin-right: 32rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
			text {
				float: left;
				font-size: 28rpx;
				padding-top: 20rpx;
			}
		}
		.wechat-code {
			width: 364rpx;
			height: 364rpx;
			margin: 50rpx auto;
			
			image {
				width: 100%;
				height: 100%;
			}
		}
		.tips {
			display: block;
			text-align: center;
			font-size: 24rpx;
			color: #555;
		}
	}
	
	
	// 直播列表内容
	.live-content {
		
		.live-item {
			margin: 32rpx 32rpx 0 32rpx;
			width: 686rpx;
			height: 340rpx;
			background: rgba(255,255,255,1);
			border-radius:16rpx;
			display: flex;
			
			.item-left {
				position: relative;
				width: 340rpx;
				height: 340rpx;
				border-radius:16rpx;
				overflow: hidden;
				
				.tips {
					position: absolute;
					top: 8rpx;
					left: 8rpx;
					height: 36rpx;
					line-height: 36rpx;
					background-color: #FF2803;
					// padding: 0 18rpx 0 0;
					border-radius: 18rpx;
					font-size: 24rpx;
					color: #fff;
					.tips-left {
						float: left;
						background-color: #FFF4F4;
						padding: 0 18rpx;
						border-radius: 18rpx;
						color: #FF2803;
					}
					view:nth-last-of-type(1) {
						line-height: 36rpx;
						float: left;
						// padding-left: 18rpx;
						text-align: right;
					}
				}
				
				.like {
					position: absolute;
					right: 20rpx;
					bottom: 20rpx;
					
					.join-live {
						display: block;
						height: 36rpx;
						line-height: 36rpx;
						color: #fff;
						background-color: #FF2803;
						padding: 0 18rpx;
						border-radius: 18rpx;
						font-size: 24rpx;
					}
				}
				navigator {
					height: 100%;
				}
				image {
					width: 340rpx !important;
					height: 340rpx !important;
				}
			}
			.item-right {
				width: 294rpx;
				margin-left: 32rpx;
				padding-top: 30rpx;
				display: flex;
				flex-direction: column;
				box-sizing: border-box;
				> text {
					font-size:24rpx;
					color:rgba(51,51,51,1);
					line-height:34rpx;
				}
				> view:nth-of-type(1) {
					height: 80rpx;
					padding: 30rpx 0;
					display: flex;
					align-items: center;
					view {
						width:40rpx;
						height:40rpx;
						background:rgba(216,216,216,1);
						border-radius: 50%;
						margin-left: 20rpx;
						margin-right: 20rpx;
						overflow: hidden;
						padding-left: 20rpx;
						
						image {
							width: 100%;
							height: 100%;
						}
					}
					text {
						font-size:24rpx;
						color:rgba(85,85,85,1);
					}
				}
				.item-pro {
					width: 294rpx;
					display: flex;
					flex-wrap: wrap;
					view {
						position: relative;
						width:140rpx;
						height:140rpx;
						background:rgba(216,216,216,1);
						border-radius: 16rpx;
						margin-right: 14rpx;
						margin-bottom: 14rpx;
						overflow: hidden;
						
						.mask-view {
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							background-color: rgba(0, 0, 0, .4);
							text-align: center;
							padding-top: 40rpx;
							box-sizing: border-box;
							
							text {
								position: static;
								display: block;
								background: transparent;
								font-size: 28rpx;
							}
						}
						
						> text{
							width: 100%;
							position: absolute;
							bottom: 10rpx;
							font-size: 12px;
							text-align: center;
							color: #fff;
							background-color: rgba(0, 0, 0, .4);
						}
						image {
							width: 100%;
							height: 100%;
						}
					}
					view:nth-of-type(2n) {
						margin-right: 0;
						
					}
				}
			}
		}
	}

	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);

		.swiper {
			width: 750rpx;
			height: 280rpx;
			swiper,
			.swiper-item,
			image {
				width: 100%;
				height: 280rpx;
			}
		}

		.page_content {
			
			/* #ifdef H5 */
			padding-top: 10rpx;
			/* #endif */
			

			.nav {
				padding: 0 0rpx 30rpx;
				flex-wrap: wrap;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 20%;
					margin-top: 30rpx;

					image {
						width: 82rpx;
						height: 82rpx;
					}
				}
			}

			.live-wrapper {
				position: relative;
				width: 100%;
				overflow: hidden;
				border-radius: 16rpx;
				margin-top: 20rpx;

				image {
					width: 100%;
					height: 400rpx;
				}

				.live-top {
					z-index: 20;
					position: absolute;
					left: 0;
					top: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					width: 180rpx;
					height: 54rpx;
					border-radius: 0rpx 0px 18rpx 0px;

					image {
						width: 30rpx;
						height: 30rpx;
						margin-right: 10rpx;
						/* #ifdef H5 */
						display: block;
						/* #endif */
					}
				}

				.live-title {
					position: absolute;
					left: 0;
					bottom: 6rpx;
					width: 100%;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					font-size: 30rpx;
					color: #fff;
					background: rgba(0, 0, 0, .35);
				}

				&.mores {
					width: 100%;

					.item {
						position: relative;
						width: 320rpx;
						display: inline-block;
						border-radius: 16rpx;
						overflow: hidden;
						margin-right: 20rpx;

						image {
							width: 320rpx;
							height: 180rpx;
							border-radius: 16rpx;
						}

						.live-title {
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							font-size: 22rpx;
						}

						.live-top {
							width: 120rpx;
							height: 36rpx;
							font-size: 22rpx;

							image {
								width: 20rpx;
								height: 20rpx;
							}
						}
					}
				}
			}

			.hot-img {
				/* #ifndef H5 */
				margin-top: 40rpx;

				/* #endif */
				swiper,
				swiper-item image {
					width: 100%;
					height: 225rpx;
				}
			}

			.explosion {
				width: 100%;
				height: 500rpx;
				margin-top: 20rpx;
				padding: 30rpx 20rpx;
				background-image: url('~@/static/images/explosion.png');
				background-size: 100% 100%;
				border-radius: 13px;

				.hd {
					display: flex;
					align-items: center;

					image {
						width: 147rpx;
						height: 35rpx;
						margin-right: 20rpx;
					}

					.txt {
						width: 220rpx;
						height: 36rpx;
						background: linear-gradient(90deg, rgba(255, 168, 0, 1) 0%, rgba(255, 34, 15, 1) 100%);
						border-radius: 26rpx 0px 26rpx 0px;
						color: #fff;
						text-align: center;
						font-size: 22rpx;
						box-shadow: 3px 1px 1px 1px rgba(255, 203, 199, .8);
					}
				}

				.bd {
					display: flex;
					flex-wrap: wrap;
					margin-top: 28rpx;

					.item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;
						width: 325rpx;
						height: 180rpx;
						margin-bottom: 20rpx;
						margin-right: 20rpx;
						background-color: #fff;
						border-radius: 16rpx;
						padding: 0 20rpx;
						box-sizing: border-box;

						image {
							width: 160rpx;
							height: 160rpx;
						}

						.con-box {
							display: flex;
							flex-direction: column;
							justify-content: center;
							width: 120rpx;
							height: 100%;

							.title {
								color: #282828;
								font-size: 30rpx;
							}

							.con {
								color: #999999;
								font-size: 20rpx;
							}

							.go {
								display: flex;
								align-items: center;
								justify-content: center;
								margin-top: 10rpx;
								width: 112rpx;
								height: 36rpx;
								border-radius: 18rpx;
								color: #fff;
								font-size: 26rpx;
								font-weight: bold;
								font-style: italic;

								image {
									width: 26rpx;
									height: 26rpx;
								}
							}
						}

						&:first-child .go {
							background: linear-gradient(90deg, rgba(75, 196, 255, 1) 0%, rgba(32, 126, 255, 1) 100%);
						}

						&:nth-child(2) .go {
							background: linear-gradient(90deg, rgba(255, 144, 67, 1) 0%, rgba(255, 83, 29, 1) 100%);
						}

						&:nth-child(3) .go {
							background: linear-gradient(90deg, rgba(150, 225, 135, 1) 0%, rgba(72, 206, 44, 1) 100%);
						}

						&:nth-child(4) .go {
							background: linear-gradient(90deg, rgba(255, 197, 96, 1) 0%, rgba(255, 156, 0, 1) 100%);
						}

						&:nth-child(2n) {
							margin-right: 0;
						}
					}
				}
			}

			.spike-box {
				margin-top: 20rpx;
				padding: 23rpx 20rpx;
				border-radius: 24rpx;
				background-color: #fff;
				overflow: hidden;
				box-shadow: 0px 0px 16px 3px rgba(0, 0, 0, 0.04);

				.hd {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						display: flex;
						align-items: center;
						width: 500rpx;

						.icon {
							width: 38rpx;
							height: 38rpx;
							margin-right: 8rpx;
						}

						.title {
							width: 134rpx;
							height: 33rpx;
						}
					}

					.more {
						font-size: 26rpx;
						color: #999;

						.iconfont {
							margin-left: 6rpx;
							font-size: 25rpx;
						}
					}
				}

				.spike-wrapper {
					width: 100%;
					margin-top: 27rpx;

					.spike-item {
						display: inline-block;
						width: 222rpx;
						margin-right: 20rpx;

						.img-box {
							position: relative;
							height: 222rpx;

							image {
								width: 100%;
								height: 222rpx;
								border-radius: 16rpx;
							}

							.msg {
								position: absolute;
								left: 10rpx;
								bottom: 16rpx;
								width: 86rpx;
								height: 30rpx;
								background: rgba(255, 255, 255, 1);
								border: 1px solid rgba(255, 109, 96, 1);
								border-radius: 6rpx;
								font-size: 20rpx;
								color: $theme-color;
							}
						}


						.info {
							margin-top: 8rpx;
							padding: 0 10rpx;

							.name {
								font-size: 28rpx;
							}

							.price-box {
								display: flex;
								align-items: center;
								justify-content: center;

								.tips {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 28rpx;
									height: 28rpx;
									background-color: $theme-color;
									color: #fff;
									font-size: 20rpx;
									border-radius: 2px;
								}

								.price {
									display: flex;
									margin-left: 10rpx;
									color: $theme-color;
									font-size: 28rpx;
									font-weight: bold;

									text {
										font-size: 18rpx;
									}
								}
							}
						}
					}
				}
			}

			.barg {
				width: 100%;
				height: 478rpx;
				margin-top: 20rpx;
				padding-left: 20rpx;
				background-image: url('~@/static/images/barg002.png');
				background-size: 100% 100%;

				.title {
					display: flex;
					align-items: center;
					justify-content: center;
					padding-top: 42rpx;

					image {
						width: 463rpx;
						height: 39rpx;
					}
				}

				.barg-swiper {
					margin-top: 43rpx;
					padding-right: 20rpx;

					.wrapper {
						display: flex;
					}

					.list-box {
						flex-shrink: 0;
						width: 210rpx;
						background-color: #fff;
						border-radius: 16rpx;
						overflow: hidden;
						padding-bottom: 18rpx;
						margin-right: 20rpx;

						image {
							width: 100%;
							height: 210rpx;
						}

						.info-txt {
							width: 100%;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							padding-top: 15rpx;

							.price {
								font-size:28rpx;
								font-family:PingFangSC-Medium,PingFang SC;
								font-weight:500;
								color:rgba(221,25,34,1);
							}
							
							.lingtxt {
								font-size:20rpx;
								font-family:PingFangSC-Regular,PingFang SC;
								font-weight:400;
								color:rgba(136,136,136,1);
							}

							.txt {
								display: flex;
								align-items: center;
								justify-content: center;
								width: 136rpx;
								height: 33rpx;
								margin-top: 10rpx;
								background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
								border-radius: 17px;
								font-size: 22rpx;
								color: #fff;

							}
						}
					}

					.more-box {
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 80rpx;
						background-color: #fff;
						border-radius: 16rpx;

						image {
							width: 24rpx;
							height: 24rpx;
							margin-top: 10rpx;
						}

						.txt {
							display: block;
							writing-mode: vertical-lr;
							font-size: 26rpx;
							line-height: 1.2;
						}
					}
				}
			}

			.group-wrapper {
				padding: 26rpx 20rpx;
				margin-top: 20rpx;
				background: #fff;
				border-radius: 24rpx;

				.hd {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						display: flex;
						align-items: center;

						.icon {
							width: 38rpx;
							height: 38rpx;
							margin-right: 8rpx;
						}

						.title {
							width: 134rpx;
							height: 33rpx;
						}

						.person {
							display: flex;
							align-items: center;
							margin-left: 40rpx;

							.avatar-box {
								display: flex;
								align-items: center;

								image {
									width: 30rpx;
									height: 30rpx;
									border-radius: 50%;
									margin-right: -10rpx;
								}
							}

							.num {
								margin-left: 18rpx;
								font-size: 26rpx;
								color: #999999;
							}
						}
					}

					.more {
						font-size: 26rpx;
						color: #999;

						.iconfont {
							margin-left: 6rpx;
							font-size: 25rpx;
						}
					}
				}

				.group-scroll {
					width: 100%;
					margin-top: 25rpx;

					.group-item {
						display: inline-block;
						width: 222rpx;
						margin-right: 20rpx;
						box-shadow: 0px 2px 6px 2px rgba(0, 0, 0, 0.03);
						border-radius: 16rpx;

						image {
							width: 100%;
							height: 222rpx;
							border-radius: 16rpx 16rpx 0 0;
						}

						.info {
							padding: 8rpx 13rpx;

							.name {
								font-size: 24rpx;
							}

							.price-box {
								display: flex;
								align-items: center;
								margin-top: 10rpx;

								.tips {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 76rpx;
									height: 30rpx;
									margin-right: 6rpx;
									background: linear-gradient(90deg, rgba(255, 0, 0, .1) 0%, rgba(255, 84, 0, .1) 100%);
									border-radius: 2px;
									font-size: 20rpx;
									color: $theme-color;
								}

								.price {
									font-size: 26rpx;
									color: $theme-color;
									font-weight: 700;

									text {
										font-size: 20rpx;
									}
								}
							}

						}

						.bom-btn {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							height: 48rpx;
							background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
							border-radius: 0px 0px 16rpx 16rpx;
							color: #fff;

						}
					}
				}
			}

			.boutique {
				margin-top: 20rpx;

				swiper,
				swiper-item,
				.slide-image {
					width: 100%;
					height: 240rpx;
					border-radius: 12rpx;
				}
			}

			.index-product-wrapper {
				margin-top: 40rpx;
				padding: 0 30rpx;

				.nav-bd {
					display: flex;
					align-items: center;

					.item {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 25%;

						.txt {
							font-size: 32rpx;
							color: #282828;
						}

						.label {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 124rpx;
							height: 32rpx;
							margin-top: 5rpx;
							font-size: 24rpx;
							color: #999;
						}

						&.active {
							color: $theme-color;

							.label {
								background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
								border-radius: 16rpx;
								color: #fff;
							}
						}
					}
				}

				.list-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					margin-top: 30rpx;

					.item {
						width: 340rpx;
						margin-bottom: 20rpx;
						background-color: #fff;
						border-radius: 10px;
						overflow: hidden;

						image {
							width: 100%;
							height: 340rpx;
						}

						.text-info {
							padding: 10rpx 20rpx 15rpx;

							.title {
								color: #222222;
							}

							.old-price {
								margin-top: 8rpx;
								font-size: 26rpx;
								color: #AAAAAA;
								text-decoration: line-through;

								text {
									margin-right: 2px;
									font-size: 20rpx;
								}
							}

							.price {
								display: flex;
								align-items: flex-end;
								color:rgba(221,25,34,1);
								font-size: 28rpx;
								font-weight: 500;

								text {
									padding-bottom: 4rpx;
									font-size: 20rpx;
									font-weight: normal;
									color:rgba(136,136,136,1);
									text-decoration:line-through;
								}

								.txt {
									display: flex;
									align-items: center;
									justify-content: center;
									width: 28rpx;
									height: 28rpx;
									margin-left: 15rpx;
									margin-bottom: 10rpx;
									border: 1px solid $theme-color;
									border-radius: 4rpx;
									font-size: 22rpx;
									font-weight: normal;
								}
							}
						}
					}

					&.on {
						display: flex;
					}
				}
			}
		}
	}

	.productList {
		background-color: #fff;
	}

	.productList .list {
		padding: 0 20rpx;
	}

	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}

	.productList .list .item {
		width: 345rpx;
		margin-top: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
	}

	.productList .list .item.on {
		width: 100%;
		display: flex;
		border-bottom: 1rpx solid #f6f6f6;
		padding: 30rpx 0;
		margin: 0;
	}

	.productList .list .item .pictrue {
		position: relative;
		width: 340rpx;
		height: 340rpx;
	}

	.productList .list .item .pictrue.on {
		width: 180rpx;
		height: 180rpx;
	}

	.productList .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}

	.productList .list .item .pictrue image.on {
		border-radius: 6rpx;
	}

	.productList .list .item .text {
		padding: 20rpx 17rpx 26rpx 17rpx;
		font-size: 30rpx;
		color: #222;
	}

	.productList .list .item .text.on {
		width: 508rpx;
		padding: 0 0 0 22rpx;
	}

	.productList .list .item .text .money {
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 8rpx;
	}

	.productList .list .item .text .money.on {
		margin-top: 50rpx;
	}

	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}

	.productList .list .item .text .vip {
		font-size: 22rpx;
		color: #aaa;
		margin-top: 7rpx;
	}

	.productList .list .item .text .vip.on {
		margin-top: 12rpx;
	}

	.productList .list .item .text .vip .vip-money {
		font-size: 24rpx;
		color: #282828;
		font-weight: bold;
	}

	.productList .list .item .text .vip .vip-money image {
		width: 46rpx;
		height: 21rpx;
		margin-left: 4rpx;
	}

	.pictrue {
		position: relative;
	}

	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background: linear-gradient(90deg, red 50%, #ff5400 100%);
	}

	.mores-txt {
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		color: #999;
		font-size: 24rpx;

		.iconfont {
			margin-top: 2rpx;
			font-size: 20rpx;
		}
	}

	.menu-txt {
		font-size: 24rpx;
		color: #454545;
	}

	.mp-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 330rpx;
		background: linear-gradient(90deg, $bg-star 50%, $bg-end 100%);
		// border-radius: 0 0 30rpx 30rpx;
	}
	.lxdzbox{
		width:190rpx;
		height:62rpx;
		border-radius:32rpx;
		border:2rpx solid rgba(255,255,255,1);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lxdztxt{
		font-size:24rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
		line-height:34rpx;
	}
	.floatright{
		position: fixed;
		z-index: 10;
		right:30rpx;
		bottom: 100rpx;
		
		image {
			width: 100rpx;
			height: 100rpx;
		}
	}
</style>
