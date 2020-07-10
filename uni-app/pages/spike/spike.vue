<template>
	<view>
		<view class="lives-head">
			 <gTabs :tabData="tabs" bgColor="#e93323" activeColor="#fff" :defaultIndex="0" :underLinePadding='70' :height="80" :itemNumber="2" @tabClick='tabClick' />
		</view>
		
		<view style="width: 750rpx;margin-top: 32rpx;" v-for="(item, index) in list" :key="index" v-if="list.length > 0">
			<image
				style="width: 690rpx;height: 260rpx;border-top-left-radius: 16rpx;border-top-right-radius: 16rpx;margin-left: 30rpx;margin-right: 30rpx;"
				@tap="detail(item.sku_id)"
				:src="item.goods_image"
			></image>
			<view class="list-box" style="margin-left: 30rpx;margin-right: 30rpx;">
				<view>
					<view style="margin-left: 30rpx;margin-right: 30rpx;">
						<text class="pname" @tap="detail(item.sku_id)">{{ item.goods_name }}</text>
					</view>
					<view class="price-box">
						
						<view style="margin-top: 10rpx;display: flex;justify-content: space-between;">
							<view class="ai-c">
								<text class="price" :style="item.time_text ? 'color: #27B232' : ''">
									秒 ¥{{ item.flash_sale_price }}
								</text>
							</view>
							<view class="ai-c" style="margin-right: 16rpx;" @tap="detail(item.sku_id)">
								<view class="bnt">
									<text>了解详情</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { getFlashSale } from '@/api/api.js'
	import store from '@/store'
	import { mapGetters } from "vuex";
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		data() {
			return {
				index: 0,
				tabs: [
					{
						state: 1,
						text: '秒杀中',
					},
					{
						state: 2,
						text: '预热中'
					},
				],
				data:{},
				list:{},
				type: 1,
			}
		},
		onLoad(){
			this.getFlashSale()
		},
		mounted() {
		},
		methods: {
			async getFlashSale(type) {
				var t = this;
				await getFlashSale({type:t.type}).then(res => {
					console.log(res.data)
					t.list = res.data[0].lists
				}).catch(res => {
					
				})
				
				console.log(t.list, 1111)
			},
			tabClick(index) {
				console.log('tabClick : index = ' + index);
				this.index = index
				var t = this;
				t.type = parseInt(index)+1;
				t.list=[];
				t.getFlashSale();
			},
			detail(id){
				uni.navigateTo({
					url:'../goods_details/index?id='+id
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
	.lives-head {
		width: 750rpx;
		height: 96rpx;
		background-color: #e93323;
	}
	.tabClass{
		color: #FFFFFF;
	}
	.selectClass{
		color: #FFFFFF;
		font-weight: 600;
	}
	.list-box{
		width: 690rpx;
		background-color: #fff;
		margin-top: -20rpx;;
		padding-top: 30rpx;
	}
	.pname{
		font-size:28rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
	}
	.price-box{
		margin-top: 30rpx;
		margin-left: 30rpx;
		padding-bottom: 20rpx;
	}
	.price{
		font-size:32rpx;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color:rgba(221,25,34,1);
	}
	.oprice{
		width: 330rpx;
		font-size:28rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(85,85,85,1);
		line-height:40rpx;
	}
	
	.bnt {
		width: 176rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 50rpx;
		color: rgba(221,25,34,1);
		border: 1rpx solid rgba(221,25,34,1);
		font-size: 27rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.bnt text{
		font-size: 28rpx;
		color: rgba(221,25,34,1);
	}
	
	.jc-c{
		display: flex;
		justify-content: center;
	}
	.ai-c{
		display: flex;
		align-items: center;
	}
	.fd-r{
		display: flex;
		flex-direction: row;
	}
	.fd-c {
		display: flex;
		flex-direction: column;
	}
</style>
