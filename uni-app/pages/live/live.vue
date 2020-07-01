<template>
	<view>
		<view style="width: 750rpx;height: 96rpx;background-color: #e93323;">
			<tabNav class="tabNav" :class="{'fixed':isFixed}" :tabTitle="navTop" @changeTab='changeTab' @emChildTab='emChildTab'
			 @childTab='childTab'></tabNav>
		</view>
		<view style="margin: 32rpx 32rpx 0 32rpx;width: 686rpx;height: 340rpx;background:rgba(255,255,255,1);border-radius:16rpx;display: flex;">
			<image style="width: 340rpx;height: 340rpx;border-radius:16rpx 0 0 16rpx" src="http://admin.crmeb.net/uploads/attach/2020/05/20200515/4868a2fc10d7c9ad130f022a11146487.jpg"></image>
			<view style="width: 294rpx;margin-left: 32rpx;margin-top: 20rpx;display: flex;flex-direction: column;">
				<text style="font-size:24rpx;color:rgba(51,51,51,1);line-height:34rpx;">【好货推荐】原产地爆款好货倾情推荐限时抢购</text>
				<view style="height: 80rpx;display: flex;align-items: center;">
					<view style="width:40rpx;height:40rpx;background:rgba(216,216,216,1);border-radius: 50%;margin-left: 20rpx;margin-right: 20rpx;"></view>
					<text style="font-size:24rpx;color:rgba(85,85,85,1);">百搭达人</text>
				</view>
				<view style="width: 294rpx;display: flex;flex-wrap: wrap;">
					<view style="width:140rpx;height:140rpx;background:rgba(216,216,216,1);border-radius: 12rpx;margin-right: 14rpx;"></view>
					<view style="width:140rpx;height:140rpx;background:rgba(216,216,216,1);border-radius: 12rpx;"></view>
				</view>
			</view>
		</view>
	</view>
			
		</view>
	</view>
</template>

<script>
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
				isFixed: false,
				navTop:[
					{cate_name: "直播中",children: [],icon: "",id: "1",pic: "",pid: "0"
					},
					{cate_name: "直播预告",children: [],icon: "",id: "2",pic: "",pid: "0"
					},
					{cate_name: "精彩回放",children: [],icon: "",id: "3",pic: "",pid: "0"
					}
				]
			}
		},
		onLoad(){
			console.log(this.navTop)
		},
		methods: {
			
		}
	}
</script>

<style>
page{
	background-color: #F8F8F8;
}
</style>
