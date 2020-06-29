<template>
	<view>
		<form @submit="formSubmit" report-submit='true'>
			<view class='addAddress'>
				<view class='list'>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>姓名</view>
						<input type='text' placeholder='请输入姓名' name='receiver_fullname' :value="userAddress.receiver_fullname" placeholder-class='placeholder'></input>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>联系电话</view>
						<input type='text' placeholder='请输入联系电话' name="receiver_phone" :value='userAddress.receiver_phone' placeholder-class='placeholder'></input>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>所在地区</view>
						<view class="address">
							<picker mode="multiSelector" @change="bindRegionChange" @columnchange="bindMultiPickerColumnChange" :value="valueRegion" :range="multiArray">
								<view class='acea-row'>
									<view class="picker">{{region[0]}}，{{region[1]}}，{{region[2]}}</view>
									<view class='iconfont icon-dizhi font-color'></view>
								</view>
							</picker>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'>详细地址</view>
						<input type='text' placeholder='请填写具体地址' name='detail_address' placeholder-class='placeholder' :value='userAddress.detail'></input>
					</view>
				</view>
				<view class='default acea-row row-middle'>
					<checkbox-group @change='ChangeIsDefault'>
						<checkbox :checked="userAddress.is_default ? true : false" />设置为默认地址</checkbox-group>
				</view>

				<button class='keepBnt bg-color' form-type="submit">立即保存</button>
				<!-- #ifdef MP -->
				<!-- <view class="wechatAddress" v-if="!id" @click="getWxAddress">导入微信地址</view> -->
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<!-- <view class="wechatAddress" v-if="this.$wechat.isWeixin() && !id" @click="getAddress">导入微信地址</view> -->
				<!-- #endif -->
			</view>
		</form>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		editAddress,
		getAddressDetail
	} from '@/api/user.js';
	import {
		getCity
	} from '@/api/api.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import wPicker from "@/components/wPicker/w-picker.vue";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
		},
		data() {
			return {
				regionDval: ['浙江省', '杭州市', '滨江区'],
				cartId: '', //购物车id
				pinkId: 0, //拼团id
				couponId: 0, //优惠券id
				id: 0, //地址id
				userAddress: {
					address_id:0,
					is_default: false
				}, //地址详情
				region: ['省', '市', '区'],
				valueRegion: [0, 0, 0],
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				province:[],
				city:[],
				district: [],
				multiArray: [],
				multiIndex: [0, 0, 0],
				cityId: 0,
				defaultRegion: ['广东省', '广州市', '番禺区'],
				defaultRegionCode: '440113',
				currnetProvinceKey:'',
				currnetCityKey:'',
				currnetAreaKey:'',
				provinceList:{},
				provinceArr:[],
				cityList:{},
				cityArr:[],
				areaList:{},
				areaArr:[],
				province_id:0,
				city_id:0,
				area_id:0
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad(options) {
			if (this.isLogin) {
				this.cartId = options.cartId || '';
				this.pinkId = options.pinkId || 0;
				this.couponId = options.couponId || 0;
				this.id = options.id || 0;
				uni.setNavigationBarTitle({
					title: options.id ? '修改地址' : '添加地址'
				})
				this.getUserAddress();
				//this.getCityList(0);
				this.getProvince();
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true)
				// #endif
			}
		},
		methods: {
			bindRegionChange: function(e) {
				let multiIndex = this.multiIndex,
					province = this.district[multiIndex[0]] || {
						c: []
					},
					city = province.c[multiIndex[1]] || {
						v: 0
					},
					multiArray = this.multiArray,
					value = e.detail.value;
					this.province_id = this.provinceList[multiIndex[0]].area_id;
					this.city_id = this.cityList[multiIndex[1]].area_id;
					this.area_id = this.areaList[multiIndex[2]].area_id;
				this.region = [multiArray[0][value[0]], multiArray[1][value[1]], multiArray[2][value[2]]]
				// this.$set(this.region,0,multiArray[0][value[0]]);
				// this.$set(this.region,1,multiArray[1][value[1]]);
				// this.$set(this.region,2,multiArray[2][value[2]]);
				this.cityId = city.v
				this.valueRegion = [0, 0, 0]
				//this.initialize();
			},
			bindMultiPickerColumnChange: function(e) {
				var t = this;
				console.log(e.detail)   // {column: 2, value: 1}
				switch (e.detail.column)  { // 此时的改变列数
				  case 0:
				      // 处理逻辑
				  		var code = t.provinceList[e.detail.value].area_id
				  		t.multiIndex[0] = e.detail.value;
				  		t.getCity(code)
				  break;
				  case 1:
				      //  处理逻辑
				  		var code = t.cityList[e.detail.value].area_id
				  		t.multiIndex[1] = e.detail.value;
				  		t.getArea(code)
				  break;
				  case 2:
				      t.multiIndex[2] = e.detail.value;
					   console.log('multiIndex',t.multiIndex);
				  break;
				}
				// // #ifdef MP
				// this.$set(this.multiArray, 0, multiArray[0]);
				// this.$set(this.multiArray, 1, multiArray[1]);
				// this.$set(this.multiArray, 2, multiArray[2]);
				// // #endif
				// // #ifdef H5
				// this.multiArray = multiArray;
				// // #endif

				// this.multiIndex = multiIndex
				// this.setData({ multiArray: multiArray, multiIndex: multiIndex});
			},
			// 授权回调
			onLoadFun: function() {
				this.getUserAddress();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			toggleTab(str) {
				this.$refs[str].show();
			},
			// bindRegionChange: function(e) {
			// 	this.$set(this, 'region', e.detail.value);
			// },
			onConfirm(val) {
				this.region = val.checkArr[0] + '-' + val.checkArr[1] + '-' + val.checkArr[2];
			},
			getUserAddress: function() {
				if (!this.id) return false;
				let that = this;
				getAddressDetail(this.id).then(res => {
					// let region = [res.data.province, res.data.city, res.data.district];
					//let region = [res.data.province, res.data.city, res.data.district];
					let region = res.data.district.split('/');
					var userAddress = {
						receiver_fullname: res.data.real_name,
						receiver_phone: res.data.phone,
						address_id: res.data.id,
						is_default: res.data.is_default,
						detail: res.data.detail,
						province_id: res.data.province_id,
						city_id: res.data.city_id,
						area_id: res.data.area_id
					}
					that.$set(that, 'province_id', res.data.province_id);
					that.$set(that, 'city_id', res.data.city_id);
					that.$set(that, 'area_id', res.data.area_id);
					that.$set(that, 'userAddress', userAddress);
					that.$set(that, 'region', region);
					that.city_id = res.data.city_id
				});
			},
			getProvince(){ // 获取省
				var t = this;
				console.log('this.getProvince();');
				getCity(0).then(e => {
					console.log(e);
					e = e.data;
					var provinceList = e.list;
					var provinceArr = e.list.map((item) => { return item.area_name }) // 获取数据里面的value值，就是只用数据的名称 
					t.multiArray = [provinceArr, [], []]; // 更新三维数组 更新后长这样 [['江苏省', '福建省'],[],[]]
					t.provinceList = provinceList;   // 省级原始数据
					t.provinceArr = provinceArr;   // 省级所有的名称
					//   })
					var defaultCode = provinceList[0].area_id  // 使用第一项当作参数获取市级数据
					console.log(defaultCode)
					if (defaultCode){
						t.currnetProvinceKey = defaultCode;
						t.getCity(defaultCode)  // 获取市级数据
					}
				})
			},
			getCity(code){ // 获取市级数据
				var t = this;
				getCity(code).then(e => {
					console.log(e);
					e = e.data
					var cityList = e.list;
					var cityArr = e.list.map((item) => { return item.area_name }) // 获取数据里面的value值，就是只用数据的名称 
					t.multiArray = [t.provinceArr, cityArr, []]; // 更新三维数组 更新后长这样 [['江苏省', '福建省'],[],[]]
					t.multiIndex[1] = '0';
					t.cityList = cityList;
					t.cityArr = cityArr;
					var defaultCode = cityList[0].area_id  // 使用第一项当作参数获取市级数据
					console.log(defaultCode)
					if (defaultCode){
						t.currnetCityKey = defaultCode;
						t.getArea(defaultCode)  // 获取市级数据
					}
				})
			},
			getArea(code){
				var t = this;
				getCity(code).then(e => {
					console.log(e);
					e = e.data
					var areaList = e.list;
					var areaArr = e.list.map((item) => { return item.area_name }) // 获取数据里面的value值，就是只用数据的名称 
					t.multiArray = [t.provinceArr, t.cityArr, areaArr]; // 更新三维数组 更新后长这样 [['江苏省', '福建省'],[],[]]
					t.multiIndex[2] = '0';
					t.areaList = areaList;
					t.areaArr = areaArr;
					console.log('multiIndex',t.multiIndex);
				})
			},
			/**
			 * 提交用户添加地址
			 * 
			 */
			formSubmit: function(e) {
				let that = this,
					value = e.detail.value;
				if (!value.receiver_fullname) return that.$util.Tips({
					title: '请填写收货人姓名'
				});
				if (!value.receiver_phone) return that.$util.Tips({
					title: '请填写联系电话'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.receiver_phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (that.region == '省-市-区') return that.$util.Tips({
					title: '请选择所在地区'
				});
				if (!value.detail_address) return that.$util.Tips({
					title: '请填写详细地址'
				});
				console.log(that.userAddress)
				value.address_id = that.userAddress.address_id;
				let regionArray = that.region;
				// value.address = {
				// 	province: regionArray[0],
				// 	city: regionArray[1],
				// 	district: regionArray[2],
				// 	city_id: that.cityId,
				// };
				value.province_id = that.province_id;
				value.city_id = that.city_id;
				value.area_id = that.area_id;
				value.is_default = that.userAddress.is_default ? 1 : 0;

				uni.showLoading({
					title: '保存中',
					mask: true
				})
				editAddress(value).then(res => {
					if (that.id)
						that.$util.Tips({
							title: '修改成功',
							icon: 'success'
						});
					else
						that.$util.Tips({
							title: '添加成功',
							icon: 'success'
						});
					setTimeout(function() {
						if (that.cartId) {
							let cartId = that.cartId;
							let pinkId = that.pinkId;
							let couponId = that.couponId;
							that.cartId = '';
							that.pinkId = '';
							that.couponId = '';
							uni.navigateTo({
								url: '/pages/users/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.id ? that.id : res.data.id) +'&pinkId=' + pinkId + '&couponId=' + couponId
							});
						} else {
							// #ifdef H5
							return history.back();
							// #endif
							// #ifndef H5
							return uni.navigateBack({
								delta: 1,
							})
							// #endif
						}
					}, 1000);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			ChangeIsDefault: function(e) {
				this.$set(this.userAddress, 'is_default', !this.userAddress.is_default);
			}
		}
	}
</script>

<style scoped lang="scss">
	.addAddress .list {
		background-color: #fff;
	}

	.addAddress .list .item {
		padding: 30rpx;
		border-top: 1rpx solid #eee;
	}

	.addAddress .list .item .name {
		width: 195rpx;
		font-size: 30rpx;
		color: #333;
	}

	.addAddress .list .item .address {
		// width: 412rpx;
		flex: 1;
		margin-left: 20rpx;
	}

	.addAddress .list .item input {
		width: 475rpx;
		font-size: 30rpx;
	}

	.addAddress .list .item .placeholder {
		color: #ccc;
	}

	.addAddress .list .item picker {
		width: 475rpx;
	}

	.addAddress .list .item picker .picker {
		width: 410rpx;
		font-size: 30rpx;
	}

	.addAddress .list .item picker .iconfont {
		font-size: 43rpx;
	}

	.addAddress .default {
		padding: 0 30rpx;
		height: 90rpx;
		background-color: #fff;
		margin-top: 23rpx;
	}

	.addAddress .default checkbox {
		margin-right: 15rpx;
	}

	.addAddress .keepBnt {
		width: 690rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 50rpx auto;
		font-size: 32rpx;
		color: #fff;
	}

	.addAddress .wechatAddress {
		width: 690rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		margin: 0 auto;
		font-size: 32rpx;
		color: #fe960f;
		border: 1px solid #fe960f;
	}
</style>
