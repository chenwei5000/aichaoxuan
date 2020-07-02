<template>
	<view>
		<view class="lives-head">
			<tabNav 
				class="tabNav" 
				:class="{'fixed':isFixed}" 
				:tabTitle="navTop" 
				@changeTab='changeTab' 
				@emChildTab='emChildTab'
				@childTab='childTab'>
			</tabNav>
		</view>
		
		<!-- 直播列表 -->
		<view class="live-content">
			<view class="lives-list" v-for="item in liveList" :key="item.id">
				
				<navigator :url="liveUrl + item.roomid + '&custom_params=' + item.status">
					<view class="live-item">
						<view class="item-left">
							<view class="tips">
								<view class="tips-left">
									<text v-if="num === 1">直播中</text>
									<text v-else-if="num === 2">直播预告</text>
									<text v-else>精彩回放</text>
								</view>
							</view>
							<view class="like">
								<text class="join-live" v-if="num === 1">进入直播</text>
								<text class="join-live" v-else-if="num === 2">订阅直播</text>
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
					</view>
				</navigator>
		</view>
		
		
	</view>
</template>

<script>
	import { get_Lives } from '@/api/api.js'
	
	import {
		mapGetters
	} from "vuex";
	import tabNav from '@/components/tabNav.vue'
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			tabNav
		},
		data() {
			return {
				liveUrl: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=',
				isFixed: false,
				navTop:[
					{cate_name: "直播中",children: [],icon: "",id: "1",pic: "",pid: "0"
					},
					{cate_name: "直播预告",children: [],icon: "",id: "2",pic: "",pid: "0"
					},
					{cate_name: "精彩回放",children: [],icon: "",id: "3",pic: "",pid: "0"
					}
				],
				// 直播间数据
				liveList: [],
				num: 1
			}
		},
		onLoad(){
			this.getLivesHosue(this.num)
			// console.log(this.navTop, 111)
			
		},
		mounted() {
		},
		methods: {
			async getLivesHosue(num) {
				await get_Lives(num, 1, 20).then(res => {
					this.liveList = res.data.live_list
				}).catch(res => {
				
				})
				
				console.log(this.liveList, 1111)
			},
			changeTab(e) {
				this.num = e.index + 1
				this.getLivesHosue(this.num)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.lives-head {
		width: 750rpx;
		height: 96rpx;
		background-color: #e93323;
	}
	
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
</style>
