<template>
	<view>
		<view class="payment" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				选择付款方式<text class="iconfont icon-guanbi" @click='close'></text>
			</view>
			<view class="item acea-row row-between-wrapper" @click='goPay(item.number || 0 , item.value)' v-for="(item,index) in payMode"
			 :key="index">
				<view class="left acea-row row-between-wrapper">
					<view class="iconfont" :class="item.icon"></view>
					<view class="text">
						<view class="name">{{item.name}}</view>
						<view class="info" v-if="item.number">
							{{item.title}} <span class="money">￥{{ item.number }}</span>
						</view>
						<view class="info" v-else>{{item.title}}</view>
					</view>
				</view>
				<view class="iconfont icon-xiangyou"></view>
			</view>
		</view>
		<view class="mask" @click='close' v-if="pay_close"></view>
	</view>
</template>

<script>
	import {
		orderPay,
		WxJsapiPay,
		WxH5Pay,
		WxWxaPay
	} from '@/api/order.js';
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import Routine from '@/libs/routine';
	export default {
		props: {
			payMode: {
				type: Array,
				default: function() {
					return [];
				}
			},
			pay_close: {
				type: Boolean,
				default: false,
			},
			order_id: {
				type: String,
				default: ''
			},
			totalPrice: {
				type: String,
				default: '0'
			},
			pay_code: {
				type: String,
				default: ''
			},
		},
		data() {
			return {

			};
		},
		methods: {
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			goPay: function(number, paytype) {
				let that = this;
				let ua = '',
					orderId = that.order_id,
					jsConfig = '';
				let data = {
					pay_code:that.pay_code
				},status ='';
				// #ifdef  MP
				status = 'WECHAT_PAY';
				console.log('WxWxaPay')
				Routine.getCode().then(code=>{
					console.log('code',code)
					data.code = code;
					WxWxaPay(data).then(res => {
						console.log(res)
						jsConfig = res.data.jsApiParams;
						console.log('jsConfig',jsConfig);
						that.topay(status,jsConfig,orderId,res)
					}).catch(err => {
						console.log(err)
						uni.hideLoading();
						return that.$util.Tips({
							title: err
						});
					});
				}).catch(e=>{
					uni.hideLoading();
				})
				// #endif
				// #ifdef  H5
				console.log('h5')
				ua = window.navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){
				    status = 'WECHAT_PAY'
					let code = uni.getStorageSync('jsapi_code');
					data.code = code;
					WxJsapiPay(data).then(res => {
						console.log(res)
						jsConfig = res.data.jsApiParams;
						console.log('jsConfig',jsConfig);
						that.topay(status,jsConfig,orderId,res)
					}).catch(err => {
						uni.hideLoading();
						return that.$util.Tips({
							title: err
						});
					});
				}else{
					status = "WECHAT_H5_PAY"
					WxH5Pay(data).then(res => {
						console.log(res)
						jsConfig = res.data;
						console.log('jsConfig',jsConfig);
						that.topay(status,jsConfig,orderId,res)
					}).catch(err => {
						uni.hideLoading();
						return that.$util.Tips({
							title: err
						});
					});
				}
				// #endif
			},
			topay(status,jsConfig, orderId,res){
				let goPages = '/pages/order_pay_status/index?order_id='+orderId;
				let that = this;
				switch (status) {
					case 'ORDER_EXIST':
					case 'EXTEND_ORDER':
					case 'PAY_ERROR':
						uni.hideLoading();
						return that.$util.Tips({
							title: '支付错误'
						}, {
							tab: 5,
							url: goPages
						});
						break;
					case 'SUCCESS':
						uni.hideLoading();
						if (that.BargainId || that.combinationId || that.pinkId || that.seckillId)
							return that.$util.Tips({
								title: '支付成功',
								icon: 'success'
							}, {
								tab: 4,
								url: goPages
							});
						return that.$util.Tips({
							title: '支付成功',
							icon: 'success'
						}, {
							tab: 5,
							url: goPages
						});
						break;
					case 'WECHAT_PAY':
						// #ifdef MP
						that.toPay = true;
						console.log('jsConfig',jsConfig);
						jsConfig = JSON.parse(jsConfig)
						console.log('timeStamp',jsConfig.timeStamp);
						console.log('paySign',jsConfig.paySign);
						uni.requestPayment({
							timeStamp: jsConfig.timeStamp,
							nonceStr: jsConfig.nonceStr,
							package: jsConfig.package,
							signType: jsConfig.signType,
							paySign: jsConfig.paySign,
							success: function(res) {
								console.log(res);
								uni.hideLoading();
								if (that.BargainId || that.combinationId || that.pinkId || that.seckillId)
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 4,
										url: goPages
									});
								return that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages
								});
							},
							fail: function(e) {
								console.log(e);
								uni.hideLoading();
								return that.$util.Tips({
									title: '取消支付'
								}, {
									tab: 5,
									url: goPages + '&status=0'
								});
							},
							complete: function(e) {
								console.log(e);
								//关闭当前页面跳转至订单状态
								if (e.errMsg == 'requestPayment:cancel') return that.$util.Tips({
									title: '取消支付'
								});
							},
						})
						// #endif
						// #ifdef H5
						console.log('公众号支付')
						jsConfig = JSON.parse(jsConfig);
						uni.removeStorageSync('jsapi_code');
						uni.setStorageSync('goPages',goPages);
						this.$wechat.pay(jsConfig).then(res => {
							uni.showToast({
								title: '支付成功',
								icon: 'success',
							})
						}).cache(res => {
							uni.removeStorageSync('goPages');
							if (res.errMsg == 'requestPayment:cancel') return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: goPages + '&status=0'
							});
						})
						// #endif
						break;
					case 'PAY_DEFICIENCY':
						uni.hideLoading();
						//余额不足
						return that.$util.Tips({
							title: '余额不足'
						}, {
							tab: 5,
							url: goPages + '&status=1'
						});
						break;
					case "WECHAT_H5_PAY": //h5
						setTimeout(() => {
							location.href = jsConfig.mweb_url+'&redirect_url=https%3A%2F%2Fyoupin.xiaosongzhixue.com%2Fstore'+encodeURIComponent(goPages);
						}, 100);
						break;
				}
			},
			goPay1: function(number, paytype) {
				let that = this;
				if (!that.order_id) return that.$util.Tips({
					title: '请选择要支付的订单'
				});
				if (paytype == 'yue' && parseFloat(number) < parseFloat(that.totalPrice)) return that.$util.Tips({
					title: '余额不足！'
				});
				uni.showLoading({
					title: '支付中'
				});
				orderPay({
					uni: that.order_id,
					paytype: paytype,
					// #ifdef MP 
					'from': 'routine',
					// #endif
					// #ifdef H5 || APP-PLUS
					'from': this.$wechat.isWeixin() ? 'weixin' : 'weixinh5',
					// #endif
				}).then(res => {
					switch (paytype) {
						case 'weixin':
							if (res.data.result === undefined) return that.$util.Tips({
								title: '缺少支付参数'
							});
							// #ifdef MP || APP-PLUS
							let jsConfig = res.data.result.jsConfig;
							uni.requestPayment({
								timeStamp: jsConfig.timestamp,
								nonceStr: jsConfig.nonceStr,
								package: jsConfig.package,
								signType: jsConfig.signType,
								paySign: jsConfig.paySign,
								success: function(res) {
									uni.hideLoading();
									return that.$util.Tips({
										title: res.msg,
										icon: 'success'
									}, () => {
										that.$emit('onChangeFun', {
											action: 'pay_complete'
										});
									});
								},
								fail: function(e) {
									uni.hideLoading();
									return that.$util.Tips({
										title: '取消支付'
									}, () => {
										that.$emit('onChangeFun', {
											action: 'pay_fail'
										});
									});
								},
								complete: function(e) {
									uni.hideLoading();
									if (e.errMsg == 'requestPayment:cancel') return that.$util.Tips({
										title: '取消支付'
									}, () => {
										that.$emit('onChangeFun', {
											action: 'pay_fail'
										});
									});
								},
							});
							// #endif
							// #ifdef H5
							let data = res.data;
							if (data.status == "WECHAT_H5_PAY") {
								uni.hideLoading();
								location.replace(data.result.jsConfig.mweb_url);
								return that.$util.Tips({
									title: "支付成功",
									icon: 'success'
								}, () => {
									that.$emit('onChangeFun', {
										action: 'pay_complete'
									});
								});
							} else {
								that.$wechat.pay(data.result.jsConfig)
									.finally(() => {
										return that.$util.Tips({
											title: "支付成功",
											icon: 'success'
										}, () => {
											that.$emit('onChangeFun', {
												action: 'pay_complete'
											});
										});
									})
									.catch(function() {
										return that.$util.Tips({
											title: '支付失败'
										});
									});
							}
							// #endif
							break;
						case 'yue':
							uni.hideLoading();
							return that.$util.Tips({
								title: res.msg,
								icon: 'success'
							}, () => {
								that.$emit('onChangeFun', {
									action: 'pay_complete'
								});
							});
							break;
						case 'offline':
							uni.hideLoading();
							return that.$util.Tips({
								title: res.msg,
								icon: 'success'
							}, () => {
								that.$emit('onChangeFun', {
									action: 'pay_complete'
								});
							});
							break;
					}
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					}, () => {
						that.$emit('onChangeFun', {
							action: 'pay_fail'
						});
					});
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 99;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		transform: translate3d(0, 100%, 0);
	}

	.payment.on {
		transform: translate3d(0, 0, 0);
	}

	.payment .title {
		text-align: center;
		height: 123rpx;
		font-size: 32rpx;
		color: #282828;
		font-weight: bold;
		padding-right: 30rpx;
		margin-left: 30rpx;
		position: relative;
		border-bottom: 1rpx solid #eee;
	}

	.payment .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 43rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.payment .item {
		border-bottom: 1rpx solid #eee;
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}

	.payment .item .left {
		width: 610rpx;
	}

	.payment .item .left .text {
		width: 540rpx;
	}

	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}

	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}

	.payment .item .left .text .info .money {
		color: #ff9900;
	}

	.payment .item .left .iconfont {
		font-size: 45rpx;
		color: #09bb07;
	}

	.payment .item .left .iconfont.icon-zhifubao {
		color: #00aaea;
	}

	.payment .item .left .iconfont.icon-yuezhifu {
		color: #ff9900;
	}

	.payment .item .left .iconfont.icon-yuezhifu1 {
		color: #eb6623;
	}

	.payment .item .iconfont {
		font-size: 0.3rpx;
		color: #999;
	}
</style>
