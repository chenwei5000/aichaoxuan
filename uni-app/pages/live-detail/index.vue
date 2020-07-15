<template>
	<view class="lives-content">
		<!-- 1.0 海报区域 -->
		<view class="pictrue-site">
			<view class="text-info">
				<view>{{ liveData.name }}</view>
				<text>{{ liveData.start_time }}开播</text>
			</view>
			<!-- #ifdef MP -->
			<subscribe class="scribe-btn" :room-id="roomid"></subscribe>
			<!-- #endif -->
			
			<!-- #ifdef H5 -->
			<button type="default" class="scribe-btn"  @click="openminishare">立即订阅</button>
			<!-- #endif -->
			<view class="pic-big">
				<image :src="liveData.cover_img" mode=""></image>
			</view>
		</view>
		
		<!-- 2.0 直播商品 -->
		<view class="live-product">
			<view class="live-product-title">
				<text>直播商品</text>
			</view>
			
			<view class="live-pro-list">
				<view class="live-pro-item" v-for="item in goodsList" :key="item.id">
					<navigator :url="item.url">
						<view class="pro-img">
							<image :src="item.cover_img" mode=""></image>
						</view>
						<text>【好货推荐】{{ item.name }}</text>
					</navigator>
				</view>
			</view>
		</view>
		
		<!-- 3.0 分享直播 -->
		<view class="share-btn">
			<!-- #ifdef MP -->
				<button @click="openPopup">分享直播</button>
			<!-- #endif -->
			
			<!-- #ifdef H5 -->
				<button @click="openminishare">分享直播</button>
			<!-- #endif -->
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="bottom-mask">
				<view class="mask-btn">
					<view class="mask-btn-left">
						<image src="../../static/images/link.png" mode=""></image>
						<view>发送小程序链接</view>
					</view>
					<view class="mask-btn-right">
						<image src="../../static/images/image.png" mode=""></image>
						<view>生成图片海报</view>
					</view>
				</view>
				<button class="cancel-btn" type="default" @click="cancelPopup">取消</button>
			</view>
		</uni-popup>

		<uni-popup ref="erweima" type="center">
			<view style="width: 600rpx;background: #fff;display: flex;flex-direction: column;align-items: center;">
				<image style="width: 500rpx;height: 500rpx;margin: 20rpx;" :src="wxa_code_image"></image>
				<view style="margin: 20rpx;font-size: 28rpx;text-align: center;">长按保存或识别进入小程序</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { 
		get_Lives_Detail,
		get_Lives_Prolist
	} from '@/api/api.js'
	import {
		getMiniShareInfo
	} from '@/api/store.js'
	export default {
		data() {
			return {
				roomid: 0,
				liveData: {},
				goodsList: [],
				wxa_code_image: ''
			}
		},
		onLoad(option) {
			// #ifdef MP
			// 小程序码携带参数的处理
			if(options.scene)
			{
				//有小程序码
				getMiniappShareInfo(decodeURIComponent(options.scene)).then(res => {
					console.log(res);
					if(res.data.shop_key) setShopKey(res.data.shop_key);
					if(res.data.room_id)
					{
						console.log('set room_id',res.data.room_id);
						this.roomid= res.data.room_id;
					}
					console.log('product id =',this.roomid);
					if (!this.roomid){
						return this.$util.Tips({
							title: '缺少参数无法查看直播'
						}, {
							tab: 3,
							url: 1
						});
					}
					this.getData();
				});
			}else
			{	// 没有小程序码
				this.roomid = option.roomId;
				if (!this.roomid){
					return this.$util.Tips({
						title: '缺少参数无法查看直播'
					}, {
						tab: 3,
						url: 1
					});
				}
				this.getData();
			}
			// #endif
			// 获取跳转过来携带的 roomID
			this.roomid = option.roomId
			this.getData()
		},
		methods: {
			async getData() {
				const { data } = await get_Lives_Detail({ roomid: this.roomid })
				this.liveData = data
				// console.log(data)
				const { data: res } = await get_Lives_Prolist({
					roomid: this.roomid,
					page: 1,
					limit: 10
				})
				// console.log(res)
				this.goodsList = res.goods_list
			},
			openPopup() {
				this.$refs.popup.open()
			},
			cancelPopup() {
				this.$refs.popup.close()
			},
			closePopup() {
				this.$refs.erweima.close()
			},
			openminishare: function() {
				this.$refs.erweima.open()
				let that = this;
				getMiniShareInfo(2, this.roomid).then(res => {
					that.wxa_code_image = res.data.wxa.wxa_code_image
				});
			},
		},
		onShareAppMessage(options) {
			　var that = this
			　　// 设置菜单中的转发按钮触发转发事件时的转发内容
			　　var shareObj = {
			　　　　title: "分享直播链接给朋友",        // 默认是小程序的名称(可以写slogan等)
			　　　　path: '',        // 默认是当前页面，必须是以‘/’开头的完整路径
			　　　　imageUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
			　　　　success: function(res){
			　　　　　　// 转发成功之后的回调
			　　　　　　if(res.errMsg == 'shareAppMessage:ok'){
			　　　　　　}
			　　　　},
			　　　　fail: function(){
			　　　　　　// 转发失败之后的回调
			　　　　　　if(res.errMsg == 'shareAppMessage:fail cancel'){
			　　　　　　　　// 用户取消转发
			　　　　　　}else if(res.errMsg == 'shareAppMessage:fail'){
			　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
			　　　　　　}
			　　　　},
			　　　　complete: function(){
			　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
			　　　　}
			　　}
			
			　　// 来自页面内的按钮的转发
			　　if( options.from == 'button' ){ }
			　　return shareObj
		}
	}
	
</script>

<style lang="scss" scoped>
	.lives-content {
		padding: 32rpx;
		padding-bottom: 232rpx;
		
		.pictrue-site {
			padding: 32rpx 44rpx;
			background-color: #fff;
			margin-bottom: 20rpx;
			border-radius: 16rpx;
			position: relative;
			
			view {
				font-size: 28rpx;
				color: #333;
			}
			text {
				font-size: 24rpx;
				color: #FF0205;
			}
			.text-info {
				margin-bottom: 32rpx;
			}
			/* #ifdef MP */
			.scribe-btn {
				position: absolute;
				top: 42rpx;
				right: 42rpx;
			}
			/* #endif */
			
			/* #ifdef H5 */
			.scribe-btn {
				position: absolute;
				top: 32rpx;
				right: 42rpx;
				width: 190rpx;
				height: 62rpx;
				line-height: 62rpx;
				border: 2rpx solid #FF0205;
				background-color: #fff;
				font-size: 24rpx;
				color: #FF0205;
				border-radius: 31rpx;
			}
			/* #endif */
			
			.pic-big {
				width: 600rpx;
				height: 600rpx;
				margin: 0 auto;
				background-color: #e4e4e4;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.live-product {
			background-color: #fff;
			border-radius: 16rpx;
			
			.live-product-title {
				padding: 20rpx 32rpx;
				border-bottom: 1px solid #F5F5F5;
			}
			
			.live-pro-list {
				padding: 0 32rpx 32rpx;
				
				.live-pro-item {
					padding: 20rpx;
					padding-right: 54rpx;
					margin-top: 20rpx;
					background-color: #F8F8F8;
					border-radius: 8rpx;
					
					navigator {
						overflow: hidden;
					}
					.pro-img {
						float: left;
						width: 120rpx;
						height: 120rpx;
						background-color: #ccc;
						image {
							width: 100%;
							height: 100%;
						}
					}
					text {
						display: block;
						padding-left: 120rpx;
						box-sizing: border-box;
						font-size: 24rpx;
						color: #555;
						margin-left: 20rpx;
						padding-top: 22rpx;
					}
				}
			}
		}
		
		.share-btn {
			width: 100%;
			height: 198rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			
			button {
				width: 486rpx;
				height: 84rpx;
				line-height: 84rpx;
				text-align: center;
				font-size: 28rpx;
				border-radius: 42rpx;
				background: linear-gradient(to right, rgb(252, 14, 30), rgb(253, 80, 31));
				color: #fff;
			}
		}
		
		.bottom-mask {
			height: 532rpx;
			background-color: #fff;
			border-radius: 16rpx 16rpx 0 0;
			
			.mask-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 80rpx 0;
				> view {
					width: 50%;
					flex: 1;
					text-align: center;
					
					image {
						width: 120rpx;
						height: 120rpx;
						line-height: 120rpx;
						background-color: #F8F8F8;
						color: #555;
						border-radius: 50%;
						margin: 0 auto;
					}
					view {
						text-align: center;
						padding: 32rpx 0;
					}
				}
			}
			.cancel-btn {
				width: 60%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				background-color: #f8f8f8;
				text-align: center;
				margin: 0 auto;
				font-size: 28rpx;
			}
		}
	}
	
</style>
