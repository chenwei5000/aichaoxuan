<template>
	<view>
		<view class='return-list' v-if="aftersaleInfo">
			<view class='goodWrapper' v-if="aftersaleInfo">
				<view class='iconfont icon-tuikuanzhong powder' v-if="aftersaleInfo.apply_state==1||aftersaleInfo.apply_state==2"></view>
				<view class='iconfont icon-yituikuan' v-if="aftersaleInfo.apply_state==4"></view>
				<view class='orderNum'>退款信息</view>
				<view class='item acea-row row-between-wrapper'>
					<view class='pictrue'>
						<image :src='aftersaleInfo.goods_image'></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{aftersaleInfo.goods_name}}</view>
							<view class='num'>x {{aftersaleInfo.goods_num}}</view>
						</view>
						<view class='attr line1' v-if="aftersaleInfo.goods_spec">{{aftersaleInfo.goods_spec}}</view>
						<view class='money'>￥{{aftersaleInfo.goods_price}}</view>
					</view>
				</view>
				<view class='totalSum'>共{{aftersaleInfo.goods_num || 0}}件商品，总金额 <text class='font-color price'>￥{{aftersaleInfo.goods_price}}</text></view>
			</view>
			<view class='wrapper'>
				<view class='item acea-row row-between' v-if="aftersaleInfo.apply_type==1">
					<view>退款原因：</view>
					<view class='conter'>{{aftersaleInfo.reason_content}}</view>
				</view>
				<view class='item acea-row row-between' v-if="aftersaleInfo.apply_type==2">
					<view>退货原因：</view>
					<view class='conter'>{{aftersaleInfo.reason_content}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>退款金额：</view>
					<view class='conter'>￥{{aftersaleInfo.refund_amount}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>申请时间：</view>
					<view class='conter'>{{aftersaleInfo.apply_time}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>退款编号：</view>
					<view class='conter'>{{aftersaleInfo.return_code}}</view>
				</view>
			</view>
			<view class='wrapper' v-if="aftersaleInfo.apply_type==2 && aftersaleInfo.apply_state!=0 && aftersaleInfo.apply_state!=3">
				<view class='item acea-row row-between'>
					<view>退货地址：</view>
					<view class='conter'>￥{{aftersaleInfo.return_address.address}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>联系人：</view>
					<view class='conter'>{{aftersaleInfo.return_address.companyname}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>联系电话：</view>
					<view class='conter'>{{aftersaleInfo.return_address.phone}}</view>
				</view>
			</view>
			<view class='wrapper' v-if="aftersaleInfo.apply_type==2 && aftersaleInfo.apply_state!=0 && aftersaleInfo.apply_state!=3">
				<view class='item acea-row row-between'>
					<view>快递名称：</view>
					<view class='conter'>￥{{aftersaleInfo.express_name}}</view>
				</view>
				<view class='item acea-row row-between'>
					<view>快递单号：</view>
					<view class='conter'>{{aftersaleInfo.shipping_code}}</view>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import home from '@/components/home';
	import {
		getAfterSaleDetail
	} from '@/api/order.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	export default {
		components: {
			home,
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				og_id:0,
				aftersaleInfo: {}, //售后信息
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad: function(options) {
			if (options.og_id) {
				this.$set(this, 'og_id', options.og_id);
			}
			this.getAftersaleInfo();
			if (this.isLogin) {
				
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true)
				// #endif
			}
		},
		methods: {
			onLoadFun() {
				this.getAftersaleInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},

			/**
			 * 获取售后列表
			 */
			getAftersaleInfo: function() {
				let that = this;
				uni.showLoading({
					title: "正在加载中"
				});
				getAfterSaleDetail({
					og_id: this.og_id
				}).then(res => {
					uni.hideLoading();
					let refundInfo = res.data.refund_info || {};
					that.$set(that,'aftersaleInfo',refundInfo);
				}).catch(err => {
					uni.hideLoading();
					that.$util.Tips({
						title: err
					}, '/pages/users/order_list/index');
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.return-list .goodWrapper {
		background-color: #fff;
		margin-top: 13rpx;
		position: relative;
	}

	.return-list .goodWrapper .orderNum {
		padding: 0 30rpx;
		border-bottom: 1px solid #eee;
		height: 87rpx;
		line-height: 87rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.return-list .goodWrapper .item {
		border-bottom: 0;
	}

	.return-list .goodWrapper .totalSum {
		padding: 0 30rpx 32rpx 30rpx;
		text-align: right;
		font-size: 26rpx;
		color: #282828;
	}

	.return-list .goodWrapper .totalSum .price {
		font-size: 28rpx;
		font-weight: bold;
	}

	.return-list .goodWrapper .iconfont {
		position: absolute;
		font-size: 109rpx;
		top: 7rpx;
		right: 30rpx;
		color: #ccc;
	}

	.return-list .goodWrapper .iconfont.powder {
		color: #f8c1bd;
	}
	
	.return-list .wrapper {
		background-color: #fff;
		margin-top: 12rpx;
		padding: 30rpx;
	}
	
	.return-list .wrapper .item {
		font-size: 28rpx;
		color: #282828;
	}
	
	.return-list .wrapper .item~.item {
		margin-top: 20rpx;
	}
	
	.return-list .wrapper .item .conter {
		color: #868686;
		width: 460rpx;
		text-align: right;
	}
</style>
