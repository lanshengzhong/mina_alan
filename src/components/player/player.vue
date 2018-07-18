<template>
  <!-- 底部播放栏 -->
  <div class='global-play'>
    <div class='content flex-center' @click="openPlayPage()">
      <div class='cover'>
        <img class='bg' :src="playinfo.cover" mode="aspectFill" alt="">
        <!-- <img class='loading' src="./../../static/images/loading.gif" mode="aspectFill" alt=""> -->
      </div>
      <div class='info'>
        <p class='title'>{{playinfo.title}}</p>
        <div class='time'>
           <p class='now'>{{timeNow}}</p> / 
           <p class='total'>{{timeEnd}}</p> 
        </div>
      </div>
      <div class='button'>
        <div class='box flex-center' style='justify-content:flex-start' v-if="!playstatus" @click.stop="playFn()">
            <img class='play' :src="icon.play" mode="aspectFit" alt="">
        </div>
        <div class='box flex-center' style='justify-content:flex-start' v-if="playstatus"  @click.stop="pauseFn()">
          <img class='pause' :src="icon.pause" mode="aspectFit" alt="">
        </div>
        <div class='box flex-center' style='justify-content:flex-end'  @click.stop="nextFn()">
           <img class='next' :src="icon.next" mode="aspectFit" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatDuration } from '@/utils/index'

export default {
  props: {

  },
  data() {
    return {
      icon: {
        play: require('@/static/images/play.png'),
        pause: require('@/static/images/pause.png'),
        next: require('@/static/images/next.png')
      },
      timeNow: '00:00',
      timeEnd: '00:00'
    }
  },
  computed: {
    ...mapState({
      playstatus: state => state.playstatus,
      activeid: state => state.activeid,
      playinfo: state => state.playinfo,
      currenttime: state => state.currenttime
    })
  },
  watch: {
    playinfo: function() {
      // 监听播放信息
      this.setTime()
    },
    currenttime: function(time) {
      // 监听时间变化
      this.timeNow = formatDuration(time)
    }
  },
  mounted() {
    // 监听音频播放
    this.audioAction()
    this.setTime()
  },
  methods: {
    ...mapActions([
      'audioAction',
      'audioNext',
      'audioPrev',
      'audioPlay',
      'audioPause'
    ]),
    setTime() {
      // 音频总时间 格式：00:00
      this.timeEnd = formatDuration(this.playinfo.duration)
    },
    openPlayPage() {
      // 打开播放页
      // 跳转到播放页
      wx.navigateTo({
        url: `/pages/play/main?type=player`
      })
    },
    playFn() {
      this.audioPlay()
    },
    pauseFn() {
      this.audioPause()
    },
    nextFn() {
      this.audioNext()
    }
  }
}
</script>

<style lang="scss">
.global-play {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: #fff;
  box-shadow: 0px -2px 5px 0px rgba(227, 227, 227, 0.6);
  .content {
    padding: 24rpx 30rpx;
    .cover {
      flex: 0 0 80rpx;
      height: 80rpx;
      text-align: center;
      margin-right: 20rpx;
      position: relative;
      img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 4rpx;
      }
      .loading {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        background-color:rgba(0,0,0,0.4);
      }
    }
    .info {
      flex: 1;
      height: 80rpx;
      font-size: 0;
      .title {
        font-size: 28rpx;
        color: #333;
        line-height: 50rpx;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .time {
        color: #c33c49;
        font-size: 24rpx;
        line-height: 30rpx;
        p {
          display: inline-block;
        }
      }
    }
    .button {
      // margin-left: 20rpx;
      flex: 0 0 130rpx;
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .box{
        flex: 1;
        height: 80rpx;
        &:first-child {
          padding-left: 10rpx;
        }
        &:last-child {
          padding-right: 10rpx;
        }
      }
      img {
        width: 34rpx;
        height: 34rpx;
      }
    }
  }
}
</style>
