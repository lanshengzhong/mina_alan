<template>
  <!--登录页  -->
  <div class="login-page">
    <img class='bg' :src="icon.bg" mode="aspectFit" alt="">
    <img class='logo' :src="icon.logo" mode="aspectFit" alt="">
    <div class="button">
      <button class="flex-center" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
      <p></p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { toast, showLoading } from '@/utils'

export default {
  data() {
    return {
      icon: {
        bg: require('@/static/images/loginbg.png'),
        logo: require('@/static/images/xcxlogo.jpg')
      }
    }
  },
  computed: {
    ...mapState({
      albumlist: state => state.albumlist
    })
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {

  },
  methods: {
    ...mapActions([
      'gotInfo'
    ]),
    getUserInfo(e) {
      // 用户允许
      if (e.mp.detail.iv) {
        showLoading('登录中')
        this.gotInfo(e.mp.detail)
      } else {
        // 用户拒绝
        toast('请先允许授权获取用户信息')
      }
    }
  }
}
</script>

<style lang="scss">
  .login-page {
    position: relative;
    .bg {
      display: block;
      width: 100%;
      height: 400rpx;
    }
    .logo {
      position: absolute;
      top: 100rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
    }

    .button {
      position: relative;
      margin-top: 110rpx;
      button {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 400rpx;
        height: 76rpx;
        background-color: #c33c49;
        box-shadow: 0 8rpx 16rpx 0#dadada;
        border-radius: 8rpx;
        font-size: 32rpx;
        color: #fff;
        margin:0 auto;
        z-index: 9;
      }
      p {
        position: absolute;
        width: 400rpx;
        height: 76rpx;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        z-index: 8;
        background-color: #c33c49;
        overflow: auto;
        border-radius: 4rpx;
        animation: sploosh3 2s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
      }
    }
  }
  
  @keyframes sploosh3 {
    0% {
      box-shadow: 0 0 0 0 rgba(195,60,73, 0.4);
      background-color: rgba(195,60,73, 0.5);
    }
    100% {
      box-shadow: 0 0 0 16rpx rgba(195,60,73, 0);
      background-color: rgba(195,60,73, 1);
    }
  }
</style>
