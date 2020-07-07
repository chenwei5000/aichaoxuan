<template>
	<view class="content">
		<!-- 1.0 评论选项切换 -->
		<view>
			<view class="rates-content">
				<scroll-view scroll-x="true" 
					style="white-space: nowrap; display: flex;" 
					scroll-with-animation 
					:scroll-left="tabLeft" 
					show-scrollbar="true">
					<view class="rates-item" 
					  :style='"width:"+isWidth+"px"' 
					  :data-index="index" 
					  :class="index===tabClick?'click':''" 
					  v-for="(item,index) in ratesList" 
					  :key="index" :id="'id'+index" 
					  @click="longClick(index)">{{ item.rates_item }} ({{ item.total }})</view>
					<view class="underlineBox" 
						:style='"transform:translateX(" + isLeft + "px);width:" + isWidth + "px"'>
						<view class="underline"></view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<!-- 2.0 评论列表展示 -->
		<view class="rates-body">
			<view class="rates-list">
				<view class="rates-info" v-for="item in dataList" :key="item.id">
					<image :src="item.goods_image" mode=""></image>
					<view class="info-right">
						<view class="rates-title">
							<view>{{ item.goods_name }}</view>
							<text>￥{{ item.goods_price }}</text>
						</view>
						<view class="rates-des">
							<view>{{ item.goods_spce }}</view>
							<text>x{{ item.goods_num }}</text>
						</view>
						<view class="rates-bottom">
							<button type="default" plain="true" 
								@click="gopage({ 
									review_id: item.review_id,
									og_id: item.og_id,
									order_id: item.order_id })">
								{{ item.review_state === '0' ? '评价' : '查看评价' }}
							</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get_Review,
		get_FinishedReview
	} from '@/api/api.js'
	
	export default {
		data() {
			return {
				ratesList: [
					{ id: 1, rates_item: '待评价', total: 0 },
					{ id: 2, rates_item: '已评价', total: 1000 },
				],
				tabClick: 0, //导航栏被点击
				isLeft: 0, //导航栏下划线位置
				isWidth: 0, //每个导航栏占位
				tabLeft:0,
				
				// 待评论数据
				waitRates: [],
				finishedRates: [],
				dataList: [],
				goPageState: 0
			}
		},
		created() {
			var that = this
			// 获取设备宽度
			uni.getSystemInfo({
				success(e) {
					that.isWidth = e.windowWidth / that.ratesList.length
				}
			})
		},
		async onLoad() {
			await this.getListData(0)
			await this.getListData(1)
			this.goPageState = 0
			this.dataList = this.waitRates
			// console.log(this.finishedRates)
		},
		methods: {
			// 导航栏点击
			longClick(index){
				this.childIndex = 0;
				if(this.ratesList.length>5){
					var tempIndex = index - 2;
					tempIndex = tempIndex<=0 ? 0 : tempIndex;
					this.tabLeft = (index-2) * this.isWidth //设置下划线位置
				}
				this.tabClick = index //设置导航点击了哪一个
				this.isLeft = index * this.isWidth //设置下划线位置
				
				this.getListData(index)
				this.dataList = index === 0 ? this.waitRates : this.finishedRates
			},
			
			// 获取待评论列表
			async getListData(n) {
				let data
				if (n === 0) {
					this.goPageState = n
					data = await get_Review(1, 20)
					this.waitRates = data.data.list
					// console.log(this.waitRates)
				} else if(n === 1) {
					this.goPageState = n
					data = await get_FinishedReview(1, 20)
					this.finishedRates = data.data.list
				}
				this.ratesList[n].total = data.data.list.length
			},
			
			// 点击页面跳转
			gopage(o) {
				console.log(this.goPageState)
				if(this.goPageState === 0) {
					uni.navigateTo({
						url:"/pages/users/goods_comment_con/index?og_id=" + o.og_id + "&orderId=" + o.order_id
					})
				}else if(this.goPageState === 1) {
					uni.navigateTo({
						url: '/pages/users/goods_comment_detail/index?product_id=' + o.review_id,
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		color: rgba(255, 255, 255, 1);
		.click {
			color: white;
		}
		.rates-content {
			width: 100%;
			/* #ifdef H5 */
			padding: 10rpx 0;
			/* #endif */
			/* #ifdef MP */
			padding-top: 12rpx;
			padding-bottom: 12rpx;
			/* #endif */
			
			background: linear-gradient(90deg, $bg-star 50%, $bg-end 100%);
			.rates-item{ 
				flex: 1;
				height: 50upx; 
				display: inline-block;
				line-height: 50upx;
				text-align: center;
				font-size: 30rpx;
				&.click{
					font-weight: bold;
				}
			}
			.underlineBox {
				height: 3px;
				width: 20%;
				display: flex;
				align-content: center;
				justify-content: center;
				transition: .5s;
				.underline {
					width: 33rpx;
					height: 4rpx;
					background-color: white;
				}
			}
		}
	
		.rates-body {
			padding: 32rpx;
			
			.rates-info {
				padding: 32rpx;
				background-color: #fff;
				border-radius: 16rpx;
				overflow: hidden;
				
				image {
					float: left;
					width: 160rpx;
					height: 160rpx;
				}
				
				.info-right {
					width: 100%;
					height: 160rpx;
					padding-left: 192rpx;
					box-sizing: border-box;
					
					.rates-title,
					.rates-des {
						width: 100%;
						color: #555;
						font-size: 28rpx;
						overflow: hidden;
						margin: 0 0 10rpx 0;
						view {
							width: 310rpx;
							white-space: nowrap;
							word-break: break-word;
							overflow: hidden;
							text-overflow: ellipsis;
							
							float: left;
						}
						text {
							float: right;
						}
					}
					.rates-title > text {
						color: #FF0205;
					}
					.rates-des {
						margin-bottom: 20rpx;
						font-size: 24rpx;
						color: #888;
					}
					.rates-bottom {
						button {
							float: right;
							min-width: 128rpx;
							height: 48rpx;
							line-height: 48rpx;
							border-radius: 24rpx;
							border: 1px solid rgba(255,2,5,1);
							color: rgba(255,2,5,1);
							font-size: 24rpx;
							padding: 0 30rpx;
						}
					}
				}
			}
		}
	}
</style>
