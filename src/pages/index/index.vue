<template>
  <!--首页  -->
  <div class="home">

    <!-- 滑动版本：专辑列表 -->
    <div class="sw-list">
      <swiper :next-margin="nextmargin" :previous-margin="prevmargin" :duration="duration" @change="change" :circular="circular" class="sw-content">
        <!-- 专辑列表 -->
        <swiper-item v-for="(album,index) in albumlist" :key="index" class="sw-item">
          <div class="content" @click="toAlbum(index, album.album.id)">
            <div class="content-box">
              <div class="bg">
                <img class='bigcover' :src="icon.bg" mode="aspectFill" alt="">
                <div class='info'>
                  <img class='smallcover' :src="album.album.cover" mode="aspectFill" alt="">
                </div>
              </div>
              <div class="desc">
                <p class="title">{{album.album.title}}</p>
                <p class="name">{{album.album.teacher}}</p>
                <img class="small" @click.stop="play(index)" :src="icon.icon" mode="aspectFill" alt="">
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper> 
      <p class="number">第{{number}}页／共{{albumlist.length}}页</p>   
    </div>

    <!-- 左右两箭头 -->
    <div class="arrows">
      <p class="left" :class="{'active': number === 1 }">
        <span></span>
      </p>
      <p class="right" :class="{'active': number === albumlist.length}">
        <span></span>
      </p>
    </div>

    <!-- 底部播放栏 -->
    <Player v-if="playflag"></Player>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Player from '@/components/player/player'
import config from '@/utils/config'

export default {
  data() {
    return {
      number: 1, // 默认是在第一页
      circular: 0, // 循环滚动
      duration: 400, // 滑动时长
      prevmargin: '95rpx', // 左边距距离
      nextmargin: '95rpx', // 右边距距离
      arrowflag: 0, // 左右两边的箭头高亮
      clockinfo: {}, // 打卡信息
      icon: {
        icon: require('@/static/images/newplay.png'),
        bg: require('@/static/images/indexbg.png')
      }
    }
  },
  computed: {
    ...mapState({
      albumlist: state => state.albumlist,
      playflag: state => state.playflag,
      clockflag: state => state.clockflag,
      jumpflag: state => state.jumpflag
    })
  },
  components: {
    Player
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {

  },
  onShow() {
    // 设置当前页title
    wx.setNavigationBarTitle({
      title: '阿兰哥哥'
    })
  },
  methods: {
    ...mapActions([
      'selectPlay'
    ]),
    change(e) {
      this.number = e.mp.detail.current + 1
    },
    play(index) {
      // 跳转播放第一集
      this.selectPlay({
        isbought: 1, // 是否购买
        programlist: this.albumlist[index], // 专辑信息
        index: 0 // 当前节目所在节目列表索引  默认第一集
      })
      // 跳转到播放页 默认播放第一集
      wx.navigateTo({
        url: `/pages/play/main?id=${this.albumlist[index].program[0].id}`
      })
    },
    toAlbum(index, id) {
      // 跳转到专辑详情页
      wx.navigateTo({
        url: `/pages/album/main?index=${index}&id=${id}`
      })
    },
    toMore() {
      // 如果是从其它小程序跳转过来的 就跳回小程序
      if (this.jumpflag) {
        wx.navigateBackMiniProgram({
          success(res) {
          // 返回成功
          },
          fail(res) {
            // 失败
            // 跳转到更多音频页面
            wx.navigateTo({
              url: `/pages/more/main`
            })
          }
        })
        return false
      }
      // 跳转到更多音频页面
      wx.navigateTo({
        url: `/pages/more/main`
      })
    }
  },
  onShareAppMessage(res) {
    // 来自页面内转发按钮
    if (res.from === 'button') {

    }
    return {
      title: config.shareinfo.title,
      path: '/pages/index/main',
      imageUrl: config.shareinfo.imageUrl,
      success: (succ) => {
        console.log(succ)
      },
      fail: (err) => {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .sw-list {
    padding-top: 40rpx;
    .sw-content {
      height: 950rpx;
      .sw-item {
        width: 560rpx;
        box-sizing: border-box;
        padding-right: 25rpx;
        .content {
          width: 100%;
          padding: 0 12rpx;
          .content-box {
            box-shadow: 0 5rpx 12rpx 0 rgba(135, 135, 135, 0.5);
            border-radius: 10rpx;
            .bg {
              position: relative;
              width: 100%;
              height: 500rpx;
              overflow: hidden;
              border-radius: 10rpx 10rpx 0 0;
              .bigcover {
                position: absolute;
                left: 0;
                top: 0;
                width: 560rpx;
                height: 500rpx;
              }
              .info {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                bottom: 0;
                .smallcover {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate3d(-50%, -50%, 0);
                  width: 300rpx;
                  height: 300rpx;
                  box-shadow: 0px 4rpx 8rpx 0px rgba(22, 22, 22, 0.54);
                }
              }
            }
            .desc {
              height: 390rpx;
              padding: 0 30rpx;
              font-size: 36rpx;
              text-align: center;
              line-height: 50rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              .title {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                margin-top: 85rpx;
                color: #333;
              }
              .name {
                margin-top: 40rpx;
                color: #666;
              }
              img {
                margin-top: 50rpx;
                margin-bottom: 10rpx;
                width: 90rpx;
                height: 90rpx;
              }
            }
          }
        }
        &.ad {
          .content {
            .bg {
              height: 712rpx;
              img {
                height: 712rpx;
              }
            }
            .morecontent {
              position: relative;
              height: 178rpx;
              button {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%,-50%,0);
                width: 296rpx;
                height: 76rpx;
                font-size: 32rpx;
                color: #c33c49;
                text-align: center;
                line-height: 76rpx;
                border-radius: 8rpx;
                background-color: #fff;
                border:1rpx solid #c33c49;
              }
            }
          }
        }
      }
    }
    .number {
      text-align: center;
      font-size: 28rpx;
      color: #666;
    }
  }
  .arrows {
    p {
      position: fixed;
      top: 580rpx;
      width: 50rpx;
      height: 100rpx;
      background-color: rgba(51, 51, 51, 0.8);
      &.active {
        background-color: rgba(51, 51, 51, 0.2);
      }
      span {
        position: absolute;
        top: 50%;
        margin-top: -13rpx;
        right: 4rpx;
        display: inline-block;
        width: 26rpx;
        height: 26rpx;
        border-top: 1rpx solid #fff;
        border-left: 1rpx solid #fff;
        transform: rotate(-45deg);
      }
    }
    .left {
      left: 0;
      border-radius: 0 8rpx 8rpx 0;
    }
    .right {
      right: 0;
      border-radius: 8rpx 0 0 8rpx;
      span {
        right: 20rpx;
        transform: rotate(135deg);
      }
    }
  }
}
</style>
