<template>
	<view class="comments-detail">
		<view class="comments-info">
			<view class="show-pro">
				<image :src="commentDetail.goods_image" mode=""></image>
				<view class="right-site">
					<view>{{ commentDetail.goods_name }}</view>
					<text>{{ commentDetail.goods_spec }}</text>
				</view>
			</view>
			
			<view class="show-rate">
				<text>商品评分</text>
				<uni-icons class="iconfont icon-shitixing" v-for="item in commentDetail.review_score - 0" :key="item" size="22"></uni-icons>
			</view>
		</view>
			
		<view class="edit-message">
			<view class="edit-text">
				<text>{{ commentDetail.review_content }}</text>
			</view>
			<view class="img-list">
				<image 
					v-for="(subItem, i) in commentDetail.review_images" 
					:key="i"
					:src="subItem" 
					mode=""></image>
			</view>
		</view>
	</view>
</template>
<home></home>
<script>
	import {
		get_ReviewDetail
	} from '@/api/api.js';
	import home from '@/components/home';
	export default {
		components:{
			home
		},
		data() {
			return {
				commentDetail: {}
			}
		},
		onLoad(option) {
			this.getDataDetail(option.product_id)
			
		},
		methods: {
			async getDataDetail(id) {
				const { data } = await get_ReviewDetail(id)
				console.log(data)
				this.commentDetail = data.detail
			}
		}
	}
</script>

<style lang="scss">
	
	.comments-detail {
		padding: 32rpx;
		border-radius: 16rpx;
		
		.comments-info {
			background-color: #fff;
			padding: 32rpx;
			border-radius: 16rpx 16rpx 0 0;
			
			.show-pro {
				image {
					float: left;
					width: 120rpx;
					height: 120rpx;
					background-color: #f4f4f4;
				}
				.right-site {
					height: 120rpx;
					font-size: 24rpx;
					padding-left: 156rpx;
					> view {
						color: #555;
						margin-bottom: 16rpx;
					}
					> text {
						color: #888;
					}
				}
			}
			
			.show-rate {
				margin-top: 28rpx;
				text:nth-of-type(1) {
					margin-right: 28rpx;
				}
				text:nth-of-type(2) {
					margin-left: 28rpx;
				}
				.icon-shitixing {
					color: #DD1922 !important;
				}
			}
		}
		
		.edit-message {
			background-color: #fff;
			padding: 32rpx;
			border-radius: 0 0 16rpx 16rpx;
			border-top: 1px solid #F5F5F5;
			
			.edit-text {
				margin-bottom: 20rpx;
				text {
					display: block;
					font-size: 24rpx;
					color: #555;
				}
			}
			.img-list {
				overflow: hidden;
				image {
					float: left;
					width: 200rpx;
					height: 200rpx;
					background-color: #f4f4f4;
					margin-right: 10rpx;
				}
				image:nth-of-type(3n) {
					margin: 0;
				}
			}
		}
	}
	
</style>
