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
		
		
		<view style="width: 750rpx;margin-top: 32rpx;" v-for="(item, index) in list" :key="index" v-if="list.length > 0">
			<view style="width: 750rpx;background-color: #fff;">
				<image
					style="width: 750rpx;height: 280rpx;"
					@tap="detail(item.spu_id)"
					:src="item.goods_image"
				></image>
				<text class="pname" @tap="detail(item.spu_id)">{{ item.goods_name }}</text>
				<view class="price-box">
					<view class="fd-r" style="margin-top: 10rpx;">
						<view class="ai-c">
							<text class="price">秒 ¥{{ item.flash_sale_price }}</text>
						</view>
						<view class="ai-c" style="margin-left: 16rpx;" @tap="detail(item.spu_id)">
							
							
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
	import tabNav from '@/components/tabNav.vue'
	export default {
		computed: mapGetters(['isLogin', 'uid']),
		components: {
			tabNav
		},
		data() {
			return {
				isFixed: false,
				navTop:[
					{cate_name: "秒杀中",children: [],icon: "",id: "1",pic: "",pid: "0"
					},
					{cate_name: "预热中",children: [],icon: "",id: "2",pic: "",pid: "0"
					}
				],
				data:{},
				list:{},
				num: 1,
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
			async getFlashSale() {
				var t = this;
				await getFlashSale({type:1}).then(res => {
					console.log(res.data)
					t.list = res.data[0].lists
				}).catch(res => {
					
				})
				
				console.log(t.list, 1111)
			},
			changeTab(e) {
				this.num = e.index + 1
				this.getLivesHosue(this.num)
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
