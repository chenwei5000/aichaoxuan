<template>
	<view>
		<view class='my-order'>
			<view class='header bg-color'>
				<view class='picTxt acea-row row-between-wrapper'>
				</view>
			</view>
			<view class='nav acea-row row-around'>
				<view class='item' :class='orderStatus==10 ? "on": ""' @click="statusClick(10)">
					<view>待付款</view>
					<view class='num'>{{orderData.unpaid_count || 0}}</view>
				</view>
				<view class='item' :class='orderStatus==20 ? "on": ""' @click="statusClick(20)">
					<view>待发货</view>
					<view class='num'>{{orderData.unshipped_count || 0}}</view>
				</view>
				<view class='item' :class='orderStatus==30 ? "on": ""' @click="statusClick(30)">
					<view>待收货</view>
					<view class='num '>{{orderData.received_count || 0}}</view>
				</view>
				<view class='item' :class='orderStatus==40 ? "on": ""' @click="statusClick(40)">
					<view>已完成</view>
					<view class='num'>{{orderData.complete_count || 0}}</view>
				</view>
			</view>
			<view class='list'>
				<view class='item' v-for="(item,index) in orderList" :key="index">
					<view>
						<view class='title acea-row row-between-wrapper'>
							<view class="acea-row row-middle">
								<text class="sign cart-color acea-row row-center-wrapper" v-if="item.bargain_id != 0">砍价</text>
								<text class="sign cart-color acea-row row-center-wrapper" v-else-if="item.combination_id != 0">拼团</text>
								<text class="sign cart-color acea-row row-center-wrapper" v-else-if="item.seckill_id != 0">秒杀</text>
								<view>{{item._add_time}}</view>
							</view>
							<view v-if="orderStatus == 10" class='font-color'>待付款</view>
							<view v-else-if="orderStatus == 20 && item.shipping_type==1" class='font-color'>待发货</view>
							<view v-else-if="orderStatus == 30 && item.shipping_type==1" class='font-color'>待收货</view>
							<view v-else-if="orderStatus == 40 && item.shipping_type==1" class='font-color'>已完成</view>
							<view v-else-if="item.shipping_type==2" class='font-color'>待核销</view>
						</view>
						<view class='item-info acea-row row-between row-top' v-for="(goods,index1) in item.cartInfo" :key="index1">
							<view class='pictrue' @click='goOrderDetails(index)'>
								<image :src='goods.productInfo.image'></image>
							</view>
							<view class='text acea-row row-between' @click='goOrderDetails(index)'>
								<view class='name line2'>{{goods.productInfo.store_name}}</view>
								<view class='money'>
									<view v-if="goods.productInfo.attrInfo">￥{{goods.productInfo.attrInfo.price}}</view>
									<view v-else>￥{{goods.productInfo.price}}</view>
									<view>x{{goods.cart_num}}</view>
								</view>
							</view>
							<view style="width: 100%;height: 50rpx;display: flex;justify-content: flex-end;" v-if="orderStatus > 0">
								<text class="btn cancel" v-if="orderStatus == 40 && goods.productInfo.review_state == 0" @tap="evaluateTap(goods.id,item.id)">去评论</text>
								<text class="btn cancel" v-if="orderStatus == 40 && goods.productInfo.review_state == 1" @tap="comment(goods.productInfo.review_id)">已评价</text>
								<text class="btn cancel" v-if="orderStatus==40 && goods.productInfo.refund_state!=1" @tap="goodsReturn(goods.productInfo.id)">申请退货</text>
								<text class="btn cancel" v-if="orderStatus==20 && goods.productInfo.refund_state!=1"  @tap="refund(goods.productInfo.id)">申请退款</text>
								<text class="btn cancel" v-if="goods.productInfo.refund_state==1"  @tap="refundDetail(goods.productInfo.id)">售后详情</text>
							</view>
						</view>
						<view class='totalPrice'>共{{item.cartInfo.length || 0}}件商品，总金额
							<text class='money font-color'>￥{{item.pay_price}}</text>
						</view>
					</view>
					<view class='bottom acea-row row-right row-middle'>
						<view class='bnt cancelBnt' v-if="orderStatus==0 || orderStatus == 9" @click='cancelOrder(index,item.id)'>取消订单</view>
						<view class='bnt bg-color' v-if="orderStatus == 0" @click='goPay(item.pay_price,item.id,item.pay_code)'>立即付款</view>
						<view class='bnt bg-color' v-else-if="orderStatus == 1 || orderStatus == 9" @click='goOrderDetails(index)'>查看详情</view>
						<view class='bnt bg-color' v-else-if="orderStatus == 2 && item.delivery_type" @click='goOrderDetails(index)'>查看详情</view>
						<!-- <view class='bnt bg-color' v-else-if="orderStatus == 3" @click='goOrderDetails(item.id)'>去评价</view> -->
						<!-- <view class='bnt bg-color' v-else-if="item.seckill_id < 1 && item.bargain_id < 1 && item.combination_id < 1 && orderStatus == 4"
						 @click='goOrderDetails(item.id)'>再次购买</view> -->
						<view class='bnt cancelBnt' v-if="orderStatus == 4" @click='delOrder(item.id,index)'>删除订单</view>
					</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length>0">
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
			<view v-if="orderList.length == 0">
				<emptyPage title="暂无订单~"></emptyPage>
			</view>
		</view>
		<view class='noCart' v-if="orderList.length == 0 && page > 1">
			<view class='pictrue'>
				<image src='/images/noOrder.png'></image>
			</view>
		</view>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
		<home></home>
		<payment :payMode='payMode' :pay_code="pay_code" :pay_close="pay_close" @onChangeFun='onChangeFun' :order_id="pay_order_id" :totalPrice='totalPrice'></payment>
	</view>
</template>

<script>
	import { HTTP_REQUEST_URL_NEW } from '@/config/app';
	import {
		getOrderList,
		orderData,
		orderCancel,
		orderDel,
		orderPay
	} from '@/api/order.js';
	import {
		getUserInfo
	} from '@/api/user.js';
	import {
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import home from '@/components/home';
	import payment from '@/components/payment';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			payment,
			home,
			emptyPage,
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				loading: false, //是否加载中
				loadend: false, //是否加载完毕
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				orderData: {}, //订单详细统计
				orderStatus: 99, //订单状态
				page: 1,
				limit: 20,
				payMode: [{
						name: "微信支付",
						icon: "icon-weixinzhifu",
						value: 'weixin',
						title: '微信快捷支付'
					}
				],
				pay_close: false,
				pay_order_id: '',
				totalPrice: '0',
				code:'',
				pay_code:'',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false //是否隐藏授权
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad: function(options) {
			if (options.status) this.orderStatus = options.status;
			// #ifdef H5
			if (this.$wechat.isWeixin()){
				if (options.code){
					this.code = options.code;
					uni.setStorageSync('jsapi_code',options.code)
				}
				this.$wechat.oAuth();
			}
			// #endif
		},
		onShow() {
			// #ifdef  H5
			if (this.$wechat.isWeixin()){
				if (!uni.getStorageSync('jsapi_code') || uni.getStorageSync('jsapi_code') == ''){
					var url = this.$wechat.getJsApiCodeUrl(location.protocol+'//'+location.hostname+'/pages/users/order_list/index?status='+this.orderStatus);
					location.href = url;
				}
			}
			if (uni.getStorageSync('goPages')){
				var goPages = uni.getStorageSync('goPages');
				uni.removeStorageSync('goPages');
				location.href = location.protocol+'//'+location.hostname+goPages;
			}
			// #endif
			if (this.isLogin) {
				// #ifdef H5 || APP-PLUS
				this.getOrderData();
				this.getOrderList();
				// #endif 
				//this.getUserInfo();
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true);
				// #endif
			}
		},
		methods: {
			onLoadFun() {
				this.getOrderData();
				this.getOrderList();
				this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 事件回调
			 * 
			 */
			onChangeFun: function(e) {
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				(action && this[action]) && this[action](value);
			},
			refund(id){
				uni.navigateTo({
					url: '/pages/users/goods_refund/index?og_id='+id,
				});
			},
			goodsReturn(id){
				uni.navigateTo({
					url: '/pages/users/goods_return/index?og_id='+id,
				});
			},
			refundDetail(id){
				uni.navigateTo({
					url: '/pages/users/user_return_detail/index?og_id='+id,
				});
			},
			comment(id){
				console.log(id)
				 uni.navigateTo({
				 	url: '/pages/users/goods_comment_detail/index?product_id=' + id
				})
			},
			/**
			 * 获取用户信息
			 * 
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					//that.payMode[1].number = res.data.now_money;
					that.$set(that, 'payMode', that.payMode);
				});
			},
			/**
			 * 关闭支付组件
			 * 
			 */
			payClose: function() {
				this.pay_close = false;
			},
			/**
			 * 获取订单统计数据
			 * 
			 */
			getOrderData: function() {
				let that = this;
				orderData().then(res => {
					that.$set(that, 'orderData', res.data);
				})
			},
			/**
			 * 取消订单
			 * 
			 */
			cancelOrder: function(index, order_id) {
				let that = this;
				if (!order_id) return that.$util.Tips({
					title: '缺少订单号无法取消订单'
				});
				orderCancel(order_id).then(res => {
					return that.$util.Tips({
						title: res.msg,
						icon: 'success'
					}, function() {
						that.orderList.splice(index, 1);
						that.$set(that, 'orderList', that.orderList);
						that.$set(that.orderData, 'unpaid_count', that.orderData.unpaid_count - 1);
						that.getOrderData();
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			/**
			 * 打开支付组件
			 * 
			 */
			goPay: function(pay_price, order_id, pay_code) {
				this.$set(this, 'pay_close', true);
				this.$set(this, 'pay_order_id', order_id);
				this.$set(this, 'totalPrice', pay_price);
				this.$set(this, 'pay_code', pay_code);
			},
			/**
			 * 支付成功回调
			 * 
			 */
			pay_complete: function() {
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.pay_close = false;
				this.pay_order_id = '';
				this.getOrderData();
				this.getOrderList();
			},
			/**
			 * 支付失败回调
			 * 
			 */
			pay_fail: function() {
				this.pay_close = false;
				this.pay_order_id = '';
			},
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(index) {
				let that = this;
				if (!that.orderList[index].id) return that.$util.Tips({
					title: '缺少订单号无法查看订单详情'
				});
				
				uni.navigateTo({
					url: '/pages/order_details/index?order_id=' + that.orderList[index].id
				})
				return;
				// #ifdef MP
				uni.showLoading({
					title: '正在加载',
				})
				openOrderSubscribe().then(() => {
					uni.hideLoading();
					uni.navigateTo({
						url: '/pages/order_details/index?order_id=' + order_id
					})
				}).catch(() => {
					uni.hideLoading();
				})
				// #endif  
				// #ifndef MP
				uni.navigateTo({
					url: '/pages/order_details/index?order_id=' + order_id
				})
				// #endif
			},
			/**
			 * 切换类型
			 */
			statusClick: function(status) {
				if (status == this.orderStatus) return;
				this.orderStatus = status;
				this.loadend = false;
				this.page = 1;
				this.$set(this, 'orderList', []);
				this.getOrderList();
			},
			/**
			 * 获取订单列表
			 */
			getOrderList: function() {
				let that = this;
				if (that.loadend) return;
				that.loading = true;
				that.loadTitle = "加载更多";
				getOrderList({
					order_state: that.orderStatus,
					page: that.page,
					limit: that.limit,
				}).then(res => {
					let list = res.data || [];
					let loadend = list.length < that.limit;
					that.orderList = that.$util.SplitArray(list, that.orderList);
					that.$set(that, 'orderList', that.orderList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				})
				
				console.log(this.orderList)
			},
			evaluateTap:function(og_id,orderId){
				uni.navigateTo({
					url:"/pages/users/goods_comment_con/index?og_id="+og_id+"&orderId="+orderId
				})
			},
			/**
			 * 删除订单
			 */
			delOrder: function(order_id, index) {
				let that = this;
				orderDel(order_id).then(res => {
					that.orderList.splice(index, 1);
					that.$set(that, 'orderList', that.orderList);
					that.$set(that.orderData, 'unpaid_count', that.orderData.unpaid_count - 1);
					that.getOrderData();
					return that.$util.Tips({
						title: '删除成功',
						icon: 'success'
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
		},
		onReachBottom: function() {
			this.getOrderList();
		}
	}
</script>

<style scoped lang="scss">
	.my-order .header {
		height: 130rpx;
		padding: 0 30rpx;
	}

	.my-order .header .picTxt {
		height: 190rpx;
	}

	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
		font-family: 'Guildford Pro';
	}

	.my-order .header .picTxt .text .name {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.my-order .header .picTxt .pictrue {
		width: 122rpx;
		height: 109rpx;
	}

	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-order .nav {
		background-color: #fff;
		width: 690rpx;
		height: 140rpx;
		border-radius: 6rpx;
		margin: -73rpx auto 0 auto;
	}

	.my-order .nav .item {
		text-align: center;
		font-size: 26rpx;
		color: #282828;
		padding: 29rpx 0;
	}

	.my-order .nav .item.on {
		font-weight: bold;
		border-bottom: 5rpx solid #e93323;
	}

	.my-order .nav .item .num {
		margin-top: 18rpx;
	}

	.my-order .list {
		width: 690rpx;
		margin: 14rpx auto 0 auto;
	}

	.my-order .list .item {
		background-color: #fff;
		border-radius: 6rpx;
		margin-bottom: 14rpx;
	}

	.my-order .list .item .title {
		height: 84rpx;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 28rpx;
		color: #282828;
	}

	.my-order .list .item .title .sign {
		font-size: 24rpx;
		padding: 0 7rpx;
		height: 36rpx;
		margin-right: 15rpx;
	}

	.my-order .list .item .item-info {
		padding: 0 30rpx;
		margin-top: 22rpx;
	}

	.my-order .list .item .item-info .pictrue {
		width: 120rpx;
		height: 120rpx;
	}

	.my-order .list .item .item-info .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.my-order .list .item .item-info .text {
		width: 486rpx;
		font-size: 28rpx;
		color: #999;
		margin-top: 6rpx;
	}

	.my-order .list .item .item-info .text .name {
		width: 306rpx;
		color: #282828;
	}

	.my-order .list .item .item-info .text .money {
		text-align: right;
	}

	.my-order .list .item .totalPrice {
		font-size: 26rpx;
		color: #282828;
		text-align: right;
		margin: 27rpx 0 0 30rpx;
		padding: 0 30rpx 30rpx 0;
		border-bottom: 1rpx solid #eee;
	}

	.my-order .list .item .totalPrice .money {
		font-size: 28rpx;
		font-weight: bold;
	}

	.my-order .list .item .bottom {
		height: 107rpx;
		padding: 0 30rpx;
	}

	.my-order .list .item .bottom .bnt {
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		border-radius: 50rpx;
		font-size: 27rpx;
	}

	.my-order .list .item .bottom .bnt.cancelBnt {
		border: 1rpx solid #ddd;
		color: #aaa;
	}

	.my-order .list .item .bottom .bnt~.bnt {
		margin-left: 17rpx;
	}

	.noCart {
		margin-top: 171rpx;
		padding-top: 0.1rpx;
	}

	.noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}

	.noCart .pictrue image {
		width: 100%;
		height: 100%;
	}
	
	.btn {
		margin-left: 18rpx;
		width: 176rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
		// border-radius: 40rpx;
		color: #fff;
		font-size: 28rpx;
	}
	
	.btn.cancel {
		color: #aaa;
		border: 1rpx solid #ddd;
	}
</style>
