<template>
	<view>
		<view class="lives-head">
			<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" :tabClass="tabClass" :selectClass="selectClass" :textFlex="true" @change="tabChange"></wuc-tab>
		</view>
		
		
		<view style="width: 750rpx;margin-top: 32rpx;" v-for="(item, index) in list" :key="index" v-if="list.length > 0">
			<view style="width: 750rpx;background-color: #fff;">
				<image
					style="width: 750rpx;height: 280rpx;"
					@tap="detail(item.spu_id)"
					:src="item.goods_image"
				></image>
				<text class="pname" @tap="detail(item.spu_id)">{{ item.goods_name }}</text>
				<view class="price-box">
					<view style="margin-top: 10rpx;display: flex;justify-content: space-between;">
						<view class="ai-c">
							<text class="price">秒 ¥{{ item.flash_sale_price }}</text>
						</view>
						<view class="ai-c" style="margin-right: 16rpx;" @tap="detail(item.spu_id)">
							<view class="bnt">
								<text>了解详情</text>
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
	import WucTab from '@/components/wuc-tab/wuc-tab.vue';
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			WucTab
		},
		data() {
			return {
				TabCur: 0,
				tabList: [{ name: '秒杀中' }, { name: '预热中' }],
				data:{},
				list:{},
				type: 1,
			}
		},
		onLoad(){
			// #ifdef MP
			let shop_key="";
			if (store.state.app.shopKey) {
				shop_key = encodeURIComponent(store.state.app.shopKey);
			}else{
				shop_key = encodeURIComponent('5pSMIG2RFGPfzcz5KeCUhQ==');
			}
			// #endif
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
			tabChange(index) {
			    this.TabCur = index;
				var t = this;
				t.type = parseInt(index)+1;
				t.getFlashSale();
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
		width: 750rpx;
		background-color: #fff;
	}
	.pname{
		font-size:28rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		margin-top: 30rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
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
