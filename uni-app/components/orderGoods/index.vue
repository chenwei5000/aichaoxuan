<template>
	<view class="orderGoods">
		<view class='total'>共{{totalNmu}}件商品</view>
		<view class='goodWrapper'>
			<view class='item acea-row row-between-wrapper' v-for="(item,index) in cartInfo" :key="index" @click="jumpCon(item.product_id)">
				<view class='pictrue'>
					<image :src='item.productInfo.attrInfo.image' v-if="item.productInfo.attrInfo"></image>
					<image :src='item.productInfo.image' v-else></image>
				</view>
				<view class='text'>
					<view class='acea-row row-between-wrapper'>
						<view class='name line1'>{{item.productInfo.store_name}}</view>
						<view class='num'>x {{item.cart_num}}</view>
					</view>
					<view class='attr line1' v-if="item.productInfo.attrInfo">{{item.productInfo.attrInfo.suk}}</view>
					<view class='money font-color' v-if="item.productInfo.attrInfo">￥{{item.productInfo.attrInfo.price}}</view>
					<view class='money font-color' v-else>￥{{item.productInfo.price}}</view>
					<view class='evaluate' v-if='evaluate==1 && item.productInfo.refund_state!=1' @click.stop="refund(item.id)">退款</view>
					<view class='evaluate' v-if='evaluate>=3 && item.productInfo.refund_state!=1' @click.stop="goodsReturn(item.id)">退货</view>
					<view class='evaluate' v-if='item.productInfo.refund_state==1' @click.stop="refundDetail(item.id)">售后详情</view>
					<view class='evaluate' style="margin-right: 150rpx;" v-if='item.productInfo.review_state ==0 && evaluate>=3' @click.stop="evaluateTap(item.id,orderId)">评价</view>
					<view class='evaluate' style="margin-right: 150rpx;" v-else-if="item.productInfo.review_state ==1 && evaluate>=3" @click.stop="comment(item.productInfo.review_id)">已评价</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			evaluate: {
				type: Number,
				default: 0,
			},
			cartInfo: {
				type: Array,
				default: function() {
					return [];
				}
			},
			orderId: {
				type: String,
				default: '',
			},
			jump: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				totalNmu:''
			};
		},
		watch:{
			cartInfo:function(nVal,oVal){
				let num = 0
				nVal.forEach((item,index)=>{
					num += Number(item.cart_num)
				})
				this.totalNmu = num
			}
		},
		methods: {
			evaluateTap:function(og_id,orderId){
				uni.navigateTo({
					url:"/pages/users/goods_comment_con/index?og_id="+og_id+"&orderId="+orderId
				})
			},
			refund(og_id){
				uni.navigateTo({
					url: '/pages/users/goods_refund/index?og_id='+og_id,
				});
			},
			goodsReturn(og_id){
				uni.navigateTo({
					url: '/pages/users/goods_return/index?og_id='+og_id,
				});
			},
			refundDetail(og_id){
				uni.navigateTo({
					url: '/pages/users/user_return_detail/index?og_id='+og_id,
				});
			},
			comment(id){
				uni.navigateTo({
					url: '/pages/users/goods_comment_detail/index?product_id='+id,
				});
			},
			jumpCon:function(id){
				if(this.jump){
					uni.navigateTo({
						url: `/pages/goods_details/index?id=${id}`
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.orderGoods {
		background-color: #fff;
		margin-top: 12rpx;
	}

	.orderGoods .total {
		width: 100%;
		height: 86rpx;
		padding: 0 30rpx;
		border-bottom: 2rpx solid #f0f0f0;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
	}
</style>
