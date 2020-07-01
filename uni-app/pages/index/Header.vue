<template>
	<view>
		<!-- 1.0 头部展示 -->
		<template name="header">
			<view class="header">
			<!-- 在小程序中，系统的显示通信商和信号的部分 -->
			<view class="sys-head" view :style="{ height: headerData.statusBarHeight }"></view>
			
			<!--  1.1 H5 页面顶部搜索栏 -->
			<view class="serch-wrapper flex">
				<view class="logo">
					<text>亲测好物</text>
				</view>
				<navigator url="/pages/goods_search/index" class="input" hover-class="none"><text class="iconfont icon-xiazai5"></text>
					搜索你想要的</navigator>
			</view>
			
			
			<!-- 1.2 H5 页面店铺信息 -->
			<view class="store-infomation">
				<view class="user-img">
					<view>
						<image :src="shopInfo.shopAvatar" alt="" mode=""></image>
					</view>
				</view>
				<view class="store-name">
					<text>{{ shopInfo.shopName }}</text>
				</view>
				<view class="button">
					<button type="default">联系店主</button>
					<!-- 微信二维码 shopInfo.shopWechatBarcode -->
				</view>
			</view>
			
				<!-- 1.3 H5 页面导航 -->
				<tabNav 
					v-if="deviveType === 'H5'" 
					class="tabNav" 
					:class="{ 'fixed': config.isFixed }" 
					:tabTitle="config.navTop" 
					@changeTab="(e) => { $emit('changeTab', e) }" 
					@emChildTab='emChildTab'
					@childTab='childTab'>
				</tabNav>
				<tabNav 
					v-else 
					class="tabNav" 
					:tabTitle="config.navTop" 
					@changeTab="(e) => { $emit('changeTab', e) }" >
				</tabNav>
			 </view>
		</template>
		
		<!-- #ifdef H5 -->
		<template is="header" :data="headerData" :value="deviveType"></template>
		<!-- #endif -->
		
		<!-- 条件注释 小程序顶部搜索栏 -->
		<!-- #ifdef MP -->
		<template is="header" :data="headerData"></template>
		<!-- #endif -->
	</view>
</template>

<script>
	// 获取手机系统信息的高度
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import tabNav from '@/components/tabNav.vue'
	export default {
		components: {
			tabNav
		},
		props: {
			config: {
				type: [Object],
				default() { return {} }
			},
			shopInfo: {
				type: [Object],
				default() { return {} }
			}
		},
		data() {
			return {
				// 头部模板数据
				headerData: {
					isFixed: false,
					type: 'H5',
					statusBarHeight: statusBarHeight
				},
				deviveType: 'H5',
				scrollHeight: 0
			}
		},
		onLoad() {
			let self = this
			
			// #ifdef MP
			// 获取小程序头部高度
			this.navH = app.globalData.navHeight;
			let info = uni.createSelectorQuery().select(".header");
			info.boundingClientRect(function(data) {
				self.marTop = data ? data.height : 0
			}).exec()
			// #endif
		},
		mounted() {
			let self = this
			// #ifdef H5
			// 获取H5 搜索框高度
			let appSearchH = uni.createSelectorQuery().select(".serch-wrapper");
			appSearchH.boundingClientRect(function(data) {
				self.searchH = data ? data.height : 0
			}).exec()
			
			// 获取店铺信息高度
			let storeInfo = uni.createSelectorQuery().select(".store-infomation");
			storeInfo.boundingClientRect(function(data) {
				self.searchH += data ? data.height : 0
			}).exec()
			// #endif
			
			this.transforHeight()
		},
		methods: {
			transforHeight() {
				this.$emit('searchHeigth', this.searchH)
			}
		}
	}
</script>

<style lang="scss">
	/* 1.0 header Site start */
	.header {
		width: 100%;
		overflow: hidden;
		background: linear-gradient(90deg, $bg-star 50%, $bg-end 100%);
	
		.serch-wrapper {
			align-items: center;
			padding: 17rpx 32rpx;
	
			.logo {
				width: 136rpx;
				height: 44rpx;
				line-height: 44rpx;
				margin-right: 20rpx;
				color: #fff;
				font-size: 32rpx;
			}
	
			.input {
				/* #ifdef H5 */
				flex-grow: 1;
				/* #endif */
				display: flex;
				align-items: center;
				height: 58rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				border-radius: 29rpx;
				color: #BBBBBB;
				font-size: 28rpx;
	
				.iconfont {
					margin-right: 20rpx;
				}
			}
		}
	
		.store-infomation {
			display: flex;
			height: 140rpx;
			padding: 0 32rpx;
			.user-img {
				// flex: 1;
				width: 156rpx;
				display: flex;
				align-items: center;
				view {
					width: 120rpx;
					height: 120rpx;
					background-color: #D8D8D8;
					border-radius: 50%;
					overflow: hidden;
					
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.store-name {
				flex: 2;
				
				text {
					font-size: 28rpx;
					line-height: 140rpx;
					color: #fff;
					letter-spacing: 2rpx;
				}
			}
			.button {
				flex: 1.5;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				
				button {
					width: 190rpx;
					height: 62rpx;
					line-height: 60rpx;
					background: transparent;
					border-radius: 31px;
					border:1px solid rgba(255,255,255,1);
					padding: 0 31rpx;
					font-size: 24rpx;
					color: #fff;
				}
			}
		}
	}
	
	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background: linear-gradient(90deg, red 50%, #ff5400 100%);
	}
	
	/* #ifdef MP */
	.header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		
		.serch-wrapper {
			padding: 10rpx 32rpx;
			.input {
				width: 342rpx;
				margin-left: -5px;
			}
		}
		
	}
	.tabNav {
		position: static;
	}
	/* #endif */
	/* header end */ 
</style>
