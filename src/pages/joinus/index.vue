<template>
  <!--加入群页面  -->
  <div class="joinus">
    <div class="content">
      <div class="cover">
        <img :src="icon.bg" mode="aspectFit" alt="">
      </div>
      <div class="info" style="display:none;">
        <h2>官方学习群</h2>
        <p>本群由红枣FM发起（一款专注于传统文化的视听APP），旨在为各地爱好者创造一个共同讨论学习的环境！</p>
        <p class="color">群内禁止发布：</p>
        <p>*任何推广性质文章、二维码；</p>
        <p>*任何与传统文化无关的纯娱乐型视频、文章；</p>
        <p>*任何拉票、捐款、谣言、涉黄、涉政治法律等内容。</p>
      </div>
      <button class="button flex-center" open-type="contact">
        进群
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      icon: {
        bg: require('@/static/images/joinbg.png')
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

  },
  methods: {
    joinUs() {
      // 打开客服对话
    }
  }
}
</script>

<style lang="scss" scoped>
  .joinus {
    .content {
      padding: 0 50rpx;
      position: relative;
      .cover {
        width: 100%;
        font-size: 0;
        img {
          width: 100%;
          height: 950rpx;
          border-radius: 10rpx;
          box-shadow: 0px 4px 8px 0 rgba(135, 135, 135, 0.4);
        }
      }
      .info {
        position: absolute;
        left: 120rpx;
        right: 120rpx;
        top: 0;
        font-size: 30rpx;
        line-height: 50rpx;
        color: #333;
        h2 {
          text-align:center;
          font-size:36rpx;
          margin-top:134rpx;
          margin-bottom: 84rpx;
        }
        .color {
          margin-top:50rpx;
          color:#c33c49;
        }
      }
      .button {
        width: 400rpx;
        height: 76rpx;
        background-color: #c33c49;
        box-shadow: 0 8rpx 16rpx 0 #dadada;
        border-radius: 8rpx;
        font-size: 32rpx;
        color: #ffffff;
        margin:0 auto;
        margin-top:70rpx;
      }
    }
  }
</style>
