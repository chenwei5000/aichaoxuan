<template>
	<view><slot :time="time" :remain="timeData.remain" :day="timeData.day" :hour="timeData.hour" :minute="timeData.minute" :second="timeData.second" /></view>
</template>

<script>
export default {
	props: {
		// 倒计时时长（单位：毫秒）
		time: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			timer: null,
			timeData: {
				remain: 0,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			}
		};
	},
	watch: {
		time() {
			this.timeData.remain = this.time;
			this.restart();
		}
	},
	methods: {
		// 更新时间
		updateTime() {
			let t = this.timeData.remain;
			this.timeData.day = Math.floor(t / 1000 / 60 / 60 / 24);
			this.timeData.hour = Math.floor((t / 1000 / 60 / 60) % 24);
			this.timeData.minute = Math.floor((t / 1000 / 60) % 60);
			this.timeData.second = Math.floor((t / 1000) % 60);
			this.timeData.remain -= 1000;
			if (this.timeData.remain < 0) {
				clearInterval(this.timer);
				this.$emit('finish');
			}
		},
		
		// 开启倒计时
		startTimer() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			this.updateTime();
			this.timer = setInterval(() => {
				this.updateTime();
			}, 1000);
		},
		
		// 重新开始倒计时
		restart() {
			this.timeData.remain = this.time;
			this.startTimer();
		},
		
		// 暂停倒计时
		pause() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},
		
		// 继续倒计时
		continue() {
			this.timeData.remain += 1000;
			this.startTimer();		
		}
	},
	mounted() {
		this.restart();
	},
	beforeDestroy() {
		clearInterval(this.timer);
	}
};
</script>
