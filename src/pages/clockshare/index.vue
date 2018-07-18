<template>
  <!--打卡排行榜  -->
  <div class="clockshare">
    <!-- 信息 -->
    <div class="shareinfo">
      <img class='bg' :src="icon.bg" mode="aspectFill" alt="">
      <div class="info">
        <div class="desc">
          <div class="head">
            <img class='head' :src="clockinfo.avatar" mode="aspectFill" alt="">
          </div>
          <div class="rank">
            <p class="text">今日第<p class="num">{{clockinfo.today_rank}}</p>位打卡</p>
          </div>
          <div class="total">
            <div>
              <p class="num">{{clockinfo.month_total}}天</p>
              <p class="text">本月学习</p>
            </div>
            <div>
              <p class="num">{{clockinfo.total}}天</p>
              <p class="text">累计学习</p>
            </div>
            <div>
              <p class="num">{{clockinfo.month_rank}}名</p>
              <p class="text">本月排名</p>
            </div>
          </div>
        </div>
        <div class="cover">
          <div class="content">
            <div class="text">
              <p>{{title}}:</p>
              <p>{{info}}</p>
            </div>
            <div class="logo flex-center">
              <img :src="icon.logo" mode="aspectFill" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="join flex-center" @click="toHome()">加入我们 一起学习</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { numberSwitch } from '@/utils'
import config from '@/utils/config'

export default {
  data() {
    return {
      clockinfo: {}, // 打卡信息
      title: config.title,
      info: config.shareinfo.title,
      icon: {
        logo: require('@/static/images/xcxlogo.jpg'),
        bg: require('@/static/images/clockbg.png')
      }
    }
  },
  computed: {
    ...mapState({
      userinfo: (state) => {
        if (state.userinfo && state.userinfo.nickName) {
          return state.userinfo
        } else {
          if (wx.getStorageSync('token')) {
            return wx.getStorageSync('userInfo')
          }
          return {}
        }
      }
    })
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {
    // 打卡信息 传递过来的
    this.clockinfo = this.$root.$mp.query
    // this.clockinfo = {
    //   'month_rank': 1,
    //   'today_rank': 26,
    //   'total': 20,
    //   'month_total': 20,
    //   'avatar': 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM6ny1aicWHUnCX7aBDPBIksR6HcYotMdXX8KiaObDXtaclQ/0'
    // }
    this.clockinfo.month_total = numberSwitch(Number(this.clockinfo.month_total))
    this.clockinfo.today_rank = numberSwitch(Number(this.clockinfo.today_rank))
    this.clockinfo.month_rank = numberSwitch(Number(this.clockinfo.month_rank))
  },
  methods: {
    toHome() {
      // 跳转首页
      wx.redirectTo({
        url: `/pages/index/main`
      })
    }
  }
}
</script>

<style lang="scss">
.clockshare {
  padding: 40rpx 50rpx 0 50rpx;
  .shareinfo {
    position: relative;
    box-shadow: 0px 4px 8px 0 rgba(135, 135, 135, 0.4);
	  border-radius: 5px;
    font-size: 0;
    >img {
      width: 100%;
      height: 876rpx;
    }
    .info {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      .desc {
        position: absolute;
        left: 16rpx;
        right: 16rpx;
        top: 22rpx;
        bottom: 196rpx;
        border: 1rpx solid #b5b1b1;
        .head {
          margin-top: 30rpx;
          text-align: center;
          img {
            margin: 0 auto;
            width: 200rpx;
            height: 200rpx;
            border: 1rpx solid #b5b1b1;
            border-radius: 50%;
          }
        }
        .rank {
          text-align: center;
          margin-top: 40rpx;
          font-size: 36rpx;
          color: #333;
          p {
            display: inline-block;
          }
          .num {
            min-width: 140rpx;
            font-size: 48rpx;
            color: #c33c49;
          }
        }
        .total {
          display: flex;
          margin-top: 80rpx;
          >div {
            flex: 1;
            height: 80rpx;
            line-height: 40rpx;
            font-size: 30rpx;
            border-right: 1rpx solid #ccc;
            text-align: center;
            &:last-child {
              border-right: 0;
            }
            .num {
              font-size: 32rpx;
              color: #c33c49;
            }
            .text {
              
            }
          }
        }
        .share {
          width: 400rpx;
          height: 76rpx;
          background-color: #c33c49;
          border-radius: 8rpx;
          font-size: 32rpx;
          color: #ffffff;
          margin:0 auto;
          margin-top: 110rpx;
        }
        .save {
          width: 400rpx;
          height: 76rpx;
          border-radius: 8rpx;
          font-size: 32rpx;
          color: #c33c49;
          margin: 0 auto;
          border: 1px solid #c33c49;
          margin-top: 30rpx;
        }
      }
    }
    .cover {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 174rpx;
      background-color: #fff;
      border-radius: 0 0 10rpx 10rpx;
      .content {
        display: flex;
        height: 196rpx;
        .text {
          flex: 1;
          padding-left: 30rpx;
          p {
            margin-top: 50rpx;
            font-size: 32rpx;
            color: #000;
            &:last-child {
              margin-top: 10rpx;
              font-size: 30rpx;
              color: #333;
            }
          }
        }
        .logo {
          flex: 0 0 204rpx;
          img {
            width: 144rpx;
            height: 144rpx;
          }
        }
      }
    }
  }
  .join {
    width: 400rpx;
    height: 76rpx;
    background-color: #c33c49;
    border-radius: 8rpx;
    font-size: 32rpx;
    color: #ffffff;
    margin:0 auto;
    margin-top: 70rpx;
  }
}
</style>
