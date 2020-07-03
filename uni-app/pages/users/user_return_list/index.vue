<template>
	<view>
		<view class='return-list' v-if="aftersaleList.length">
			<view class='goodWrapper' v-for="(item,index) in aftersaleList" :key="index" @click='goOrderDetails(item.return_id)'>
				<view class='iconfont icon-tuikuanzhong powder' v-if="item.apply_state==1||item.apply_state==2"></view>
				<view class='iconfont icon-yituikuan' v-if="item.apply_state==4"></view>
				<view class='orderNum'>订单号：{{item.order_code}}</view>
				<view class='item acea-row row-between-wrapper'>
					<view class='pictrue'>
						<image :src='item.goods_image'></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{item.goods_name}}</view>
							<view class='num'>x {{item.goods_num}}</view>
						</view>
						<view class='attr line1' v-if="item.goods_spec">{{item.goods_spec}}</view>
						<view class='money'>￥{{item.goods_price}}</view>
					</view>
				</view>
				<view class='totalSum'>共{{item.goods_num || 0}}件商品，总金额 <text class='font-color price'>￥{{item.goods_price}}</text></view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper'>
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
		</view>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
		<home></home>
	</view>
</template>

<script>
	import home from '@/components/home';
	import {
		getAfterSaleList2
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
				loading: false,
				loadend: false,
				loadTitle: '加载更多', //提示语
				aftersaleList: [], //订单数组
				orderStatus: -3, //订单状态
				page: 1,
				limit: 20,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false //是否隐藏授权
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				this.getAftersaleList();
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
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getAftersaleList();
		},
		methods: {
			onLoadFun() {
				this.getAftersaleList();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(return_id) {
				if (!return_id) return that.$util.Tips({
					title: '缺少售后编号无法查看售后详情'
				});
				uni.navigateTo({
					url: '/pages/users/user_return_detail/index?return_id=' + return_id
				})
			},

			/**
			 * 获取售后列表
			 */
			getAftersaleList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "";
				getAfterSaleList2({
					page_no: that.page,
					page_size: that.limit,
				}).then(res => {
					let list = res.data.aftersale_list || [];
					let loadend = list.length < that.limit;
					that.aftersaleList = that.$util.SplitArray(list, that.aftersaleList);
					that.$set(that,'aftersaleList',that.aftersaleList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "我也是有底线的" : '加载更多';
					that.page = that.page + 1;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
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
</style>
