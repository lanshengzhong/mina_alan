<template>
  <!--更多音频页  -->
  <div class="more-page">
    <div class="content">
      <div class="info">
        <div class="title">
          <img :src="icon.logo" mode="aspectFit" alt="">
          <p>音频内容，全部由红枣FM提供</p>
        </div>
        <p class="desc">
          <span>红枣FM：</span>
          一款专注于传统文化的音频APP，收录超50000集精品音频~
        </p>
      </div>
      <div class="classify">
        <p class="color">分类齐全：</p>
        <p>中医：养生、中药、名医典籍、经络穴位、针灸、艾灸、推拿</p>
        <p>传统：国学、历史、文学诗词、古典音乐、风水、戏曲、小品</p>
      </div>
      <div class="teacher">
        <p class="color">名师荟萃：</p>
        <p>文化名师：蒋勋、曾仕强、南怀瑾、郦波、蒙曼、康震、于丹、易中天…</p>
        <p>中医大家：徐文兵、倪海厦、郝万山、曲黎敏、罗大伦、李可、刘力红…</p>
      </div>
      <div class="download">
        各大应用市场搜索“红枣FM”，即可下载收听！
      </div>
      <button class="button flex-center" open-type="share">
        <img :src="icon.wx" mode="aspectFit" alt="">
        分享到群
      </button>
      <!-- <button class="button flex-center" open-type="getUserInfo" @getuserinfo="getInfo">
        获取用户信息
      </button> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      icon: {
        logo: require('@/static/images/logo.png'),
        wx: require('@/static/images/wx.png')
      }
    }
  },
  computed: {
    ...mapState({
      albumlist: state => state.albumlist,
      playflag: state => state.playflag
    })
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#e75f6c'
    })
  },
  methods: {
    getInfo(e) {
      // 打开客服对话
      console.log(e)
    }
  }
}
</script>

<style lang="scss">
  page {
    height:100%;
    background: linear-gradient(180deg, #e75f6c, #c33c49);
  }
  .more-page {
    height: 100%;
    .content {
      padding: 0 30rpx;
      overflow: hidden;
      .info {
        margin-top: 50rpx;
        color: #333;
        background-color: #ffffff;
	      border-radius: 8rpx 10rpx 10rpx 10rpx;
        .title {
          text-align: center;
          border-bottom: 1rpx solid #ddd;
          line-height: 95rpx;
          img {
            display: inline-block;
            vertical-align: middle;
            width: 55rpx;
            height: 55rpx;
          }
          p {
            display: inline-block;
            margin-left: 8rpx;
            font-size: 36rpx;
          }
        }
        .desc {
          font-size: 30rpx;
          line-height: 48rpx;
          padding: 28rpx 20rpx 46rpx 30rpx;
          span {
            color: #c33c49;
          }
        }
      }
      .classify,.teacher {
        margin-top: 20rpx;
        color: #333;
        background-color: #ffffff;
	      border-radius: 8rpx;
        padding: 20rpx;
        p {
          font-size: 30rpx;
          line-height: 48rpx;
          word-wrap:break-word;
          &.color {
            color: #c33c49;
          }
        }
      }
      .download {
        text-align: center;
        font-size: 30rpx;
        color: #fff;
        margin-top: 40rpx;
      }
      .button {
        width: 400rpx;
        height: 76rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 32rpx;
        color: #c8444a;
        margin:0 auto;
        margin-top: 80rpx;
        img {
          display: inline-block;
          width: 50rpx;
          height: 50rpx;
          margin-right: 20rpx;
        }
      }
    }
  }
</style>
