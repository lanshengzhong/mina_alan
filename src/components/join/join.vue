<template>
    <!--加群  -->
    <div class='album-join'>
      <button class='content' @click="toJoin()">
        <div class='icon'>
          <img :src="join" mode="aspectFit" alt="">
        </div>
        <div class='info'>
          <p>官方学习群</p>
          <p>点击「进群」获取进群二维码</p>
        </div>
        <div class='button flex-center'>
          <button class='flex-center' hover-class="hover">进群</button>
        </div>
      </button>
    </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      join: require('@/static/images/join.png')
    }
  },
  mounted() {

  },
  methods: {
    toJoin() {
      // 跳转至加群页
      wx.navigateTo({
        url: `/pages/joinus/main`
      })
    }
  }
}
</script>

<style lang="scss">
/* 加群  */

.album-join {
  padding: 30rpx 0;
}

.album-join .content {
  padding: 0;
  box-sizing:border-box;
  border-radius: 0;
  background-color: #fff;
  text-align:left;
  display: flex;
  justify-content: space-between;
  overflow:inherit !important;
}
.album-join .content::after {
  border: 0;
}
.album-join .content.hover .button button {
  background-color: #c33c49;
  color: #fff;
}
.album-join .content .icon {
  flex: 0 0 100rpx;
  height: 100rpx;
  margin-right: 30rpx;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 22rpx;
    height: 22rpx;
    border-radius: 50%;
    background-color: #c33c49;
    right: -4rpx;
    top: -4rpx;
  }
}

.album-join .content .icon img {
  width: 100rpx;
  height: 100rpx;
}

.album-join .content .info {
  flex: 1;
  height: 100rpx;
}

.album-join .content .info p {
  display: block;
  font-size: 28rpx;
  line-height: 60rpx;
  color: #333;
}

.album-join .content .info p:last-child {
  font-size: 22rpx;
  color:#888;
  line-height: 40rpx;
}

.album-join .content .button {
  flex: 0 0 140rpx;
  height: 100rpx;
}

.album-join .content .button contact-button {
  flex:0 0 140rpx;
  height: 100rpx;
  font-size: 24rpx;
  color: #c33c49;
  box-sizing: border-box;
  padding: 0;
}

.album-join .content .button button {
  flex:0 0 140rpx;
  height:60rpx;
  font-size:26rpx;
  color:#c33c49;
  border-radius:6rpx;
  box-sizing:border-box;
  padding:0;
  background-color:#c33c49;
  color:#ffffff;
}

.album-join .content .button button.hover {
  background-color: #c33c49;
  color: #fff;
}

.album-join .content .button button::after {
  border-color: #c33c49 !important;
}
</style>
