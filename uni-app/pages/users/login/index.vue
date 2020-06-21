<template>
	<div class="register absolute">
		<div class="shading">
			<div class=" acea-row row-center-wrapper">
			</div>
		</div>
		<div class="whiteBg">
			<div class="title acea-row row-center-wrapper">
				<div class="item on" >
					账号登录
				</div>
			</div>
			<div class="list" :hidden="current !== 0">
				<form @submit.prevent="submit">
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/phone_1.png"></image>
							<input type="text" placeholder="输入手机号码" v-model="account" required />
						</div>
					</div>
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/code_2.png"></image>
							<input type="text" placeholder="填写短信验证码" v-model="verify_code" required />
						</div>
					</div>
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/code_2.png"></image>
							<input type="password" placeholder="填写登录密码" v-model="password" required />
						</div>
					</div>
				</form>
			</div>
			<div class="logon" @click="submit" :hidden="current === 1">登录</div>
			<div class="tip">
			</div>
		</div>
		
		<div class="bottom"></div>
	</div>
</template>
<script>
	import dayjs from "@/plugin/dayjs/dayjs.min.js";
	import {
		loginH5,
		getUserInfo
	} from "@/api/user";
	
	import attrs, {
		required,
		alpha_num,
		chs_phone
	} from "@/utils/validate";


	const BACK_URL = "login_back_url";

	export default {
		name: "Login",
		data: function() {
			return {
				current: 0,
				account: "",
				password: "",
				verify_code:'',
				captcha: "",
				type: "login",
				logoUrl: "",
				keyCode: "",
				codeUrl: "",
				codeVal: "",
				isShowCode: false
			};
		},
		watch:{
		},
		mounted: function() {
		},
		methods: {
			async submit() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请填写账号'
				});
				if (!that.verify_code) return that.$util.Tips({
					title: '请填写短信验证码'
				});
				if (!/^[\w\d]{5,16}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的账号'
				});
				if (!that.password) return that.$util.Tips({
					title: '请填写密码'
				});
				loginH5({
						account: that.account,
						password: that.password,
						verify_code: that.verify_code
					})
					.then(({
						data
					}) => {
						let newTime = Math.round(new Date() / 1000);
						that.$store.commit("LOGIN", {
							'token': data.token,
							'time': dayjs(data.expires_time) - newTime
						});
						const backUrl = that.$Cache.get(BACK_URL) || "/pages/index/index";
						that.$Cache.clear(BACK_URL);
						getUserInfo().then(res => {
							that.$store.commit("SETUID", res.data.uid);
							if (backUrl === '/pages/index/index' || backUrl === '/pages/order_addcart/order_addcart' || backUrl ==='/pages/user/index') {
								uni.switchTab({
									url: backUrl
								});
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						})
					})
					.catch(e => {
						that.$util.Tips({
							title: e
						});
					});
			}
		}
	};
</script>
<style lang="scss">
	.code img {
		width: 100%;
		height: 100%;
	}

	.acea-row.row-middle {
		input {
			margin-left: 20rpx;
		}
	}
</style>
