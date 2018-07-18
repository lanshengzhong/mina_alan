<template>
	<div class="loading-more flex-center">
		<span class="icon" v-if="moreflag"></span>
		<p v-if="moreflag">正在加载中...</p>
		<p v-else>{{ info }}</p>
	</div>
</template>

<script>
export default {
  props: {
    moreflag: Boolean,
    info: {
      type: String,
      default: '已加载完成'
    }
  }
}
</script>

<style lang="scss">

.loading-more {
	font-size: 28rpx;
	height: 80rpx;
	.icon {
		width: 40rpx;
		height: 40rpx;
		background: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMTIwIDEyMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB4bWxuczp4bGluaz0naHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc+PGRlZnM+PGxpbmUgaWQ9J2wnIHgxPSc2MCcgeDI9JzYwJyB5MT0nNycgeTI9JzI3JyBzdHJva2U9JyM2YzZjNmMnIHN0cm9rZS13aWR0aD0nMTEnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcvPjwvZGVmcz48Zz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDYwLDYwKScvPjx1c2UgeGxpbms6aHJlZj0nI2wnIG9wYWNpdHk9Jy4yNycgdHJhbnNmb3JtPSdyb3RhdGUoNjAgNjAsNjApJy8+PHVzZSB4bGluazpocmVmPScjbCcgb3BhY2l0eT0nLjI3JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDEyMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMjcnIHRyYW5zZm9ybT0ncm90YXRlKDE1MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuMzcnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNDYnIHRyYW5zZm9ybT0ncm90YXRlKDIxMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNTYnIHRyYW5zZm9ybT0ncm90YXRlKDI0MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNjYnIHRyYW5zZm9ybT0ncm90YXRlKDI3MCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuNzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwMCA2MCw2MCknLz48dXNlIHhsaW5rOmhyZWY9JyNsJyBvcGFjaXR5PScuODUnIHRyYW5zZm9ybT0ncm90YXRlKDMzMCA2MCw2MCknLz48L2c+PC9zdmc+) no-repeat;
		animation: turn 1s steps(12, end) infinite;
	}
	p {
		color: #aaa;
		margin-left: 10rpx;
	}
}

@keyframes turn {
	to {
		transform: rotate(1turn);
	}
}

</style>