<template>
	<view class="lottie-bg">
		<view id="lottie">
			登录中...
		</view>
	</view>
</template>

<script>
	import wechat from "@/libs/wechat";
	import {
		getUserInfo
	} from "@/api/user";
	export default {
		name: "Auth",
		mounted() {

		},
		onLoad(option) {
			let that = this
			const {
				code,
				state
			} = option;
			wechat.auth(code, state)
				.then(() => {
					getUserInfo().then(res => {
						that.$store.commit("SETUID", res.data.uid);
						location.href = decodeURIComponent(
							decodeURIComponent(option.back_url)
						);
					}).catch(res => {
						alert(res)
					});
				})
				.catch(() => {
					location.replace("/");
				});
		}
	};
</script>

<style scoped lang="scss">
	.lottie-bg {
		position: fixed;
		left: 0;
		top: 0;
		background-color: #fff;
		width: 100%;
		height: 100%;
		z-index: 999;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	#lottie {
		display: block;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		transform: translate3d(0, 0, 0);
		margin: auto;

		image {
			width: 200rpx;
			height: 200rpx;
		}
	}
</style>