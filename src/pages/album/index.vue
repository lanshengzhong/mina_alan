<template>
  <!--专辑详情页  -->
  <div class="album">
    <!--信息  -->
    <div class='album-content padding-30'>
      <!--封面  -->
      <div class='album-cover'>
        <div class='content'>
          <img class='bg' :src="icon.bg" mode="aspectFit" alt="">
          <div class='info'>
            <div class='desc'>
              <img class='cover' :src="album.cover" mode="aspectFill" alt="">
              <p class='title'>{{album.title}}</p>
              <p class='teacher'>{{album.teacher}}</p>
            </div>
          </div>
        </div>
      </div>

      <!--分享/付费功能  -->
      <div class='album-share'>
        <div class='content'>
          <div class='button'>
            <button class='button-share' open-type="share">分享给朋友听</button>
            <button class='button-poster' @click="createPoster()">生成海报</button>
          </div>
        </div>
      </div>

      <!--简介  -->
      <div class='album-intro'>
        <div class='content'>
          <p class='title'>内容简介</p>
          <div class='intro' @click='introShow()'>
            <p :class="{'active': introflag}">{{album.info}}</p>
            <div class="up" :class="{'active': introflag}"></div>
          </div>
        </div>
      </div>
    </div>
    <!--列表  -->
    <div class="album-list" :class="{'play': playflag}">
      <div class="album-list-content" :class="{'active': activeid == program.id}" v-for="(program,index) in programs" :key="index" @click="bindPlay(program,index)" >
        <div class='content flex-center'>
          <!-- <div class='number'>
            <p>{{index+1}}</p>
          </div> -->
          <div class="info" :class="{'active': boughtflag}">
            <p class='title'>{{program.title}}</p>
            <img class='icon' :src="icon.time" mode="aspectFit" alt="">
            <p class='time'>{{program.duration}}</p>
          </div>
          <div class='state' v-if="!boughtflag">
            <!-- <p v-if="index < 3">试听</p> -->
            <img v-if="index >= 3" :src="icon.suo" mode="aspectFit" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 底部播放栏 -->
    <Player v-if="playflag"></Player>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { formatDuration } from '@/utils'
import Player from '@/components/player/player'

export default {
  components: {
    Player
  },
  data() {
    return {
      album: {}, // 专辑信息
      programs: [], // 节目列表
      icon: {
        suo: require('@/static/images/suo.png'),
        time: require('@/static/images/time.png'),
        bg: require('@/static/images/albumbg.png')
      },
      introflag: 1, // 简介的显示隐藏
      boughtflag: 0 // 是否购买专辑
    }
  },
  computed: {
    ...mapState({
      playflag: state => state.playflag,
      userinfo: (state) => {
        if (state.userinfo && state.userinfo.nickName) {
          return state.userinfo
        } else {
          if (wx.getStorageSync('token')) {
            return wx.getStorageSync('userInfo')
          }
          return {}
        }
      },
      albumlist: state => state.albumlist,
      activeid: state => state.activeid,
      adflag: state => state.adflag
    })
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {
    // 获取当前专辑信息所在整个专辑列表数组的索引
    this.index = this.$root.$mp.query.index
    // 设置当前页title
    wx.setNavigationBarTitle({
      title: this.albumlist[this.index].album.title
    })
    // 处理数据
    this.disposeData()
    // 由于跳转同路由数据不更新  所以需要重新初始化数据
    this.introflag = 1
  },
  methods: {
    ...mapMutations({
      setisbought: 'SET_ISBOUGHT'
    }),
    ...mapActions([
      'selectPlay'
    ]),
    disposeData() {
      // 处理数据
      this.album = this.albumlist[this.index].album
      let arr = [] // 创建新数组
      this.albumlist[this.index].program.forEach(item => {
        arr.push({
          ...item,
          duration: formatDuration(item.duration)
        })
      })
      this.programs = arr
    },
    bindPlay(program, index) {
      /*
        用户点击节目的播放
        1.判读是否购买
        2.记录当前播放的节目id 高亮显示
        3.是否重复点击  即正在播放的再次点击
      */
      // 未购买
      if (!this.boughtflag && program.index > 2) {
        wx.showToast({
          title: '未购买,请先购买后重试',
          icon: 'none',
          duration: 2000
        })
        return false
      }

      this.selectPlay({
        isbought: this.boughtflag, // 是否购买
        programlist: this.albumlist[this.index], // 专辑信息
        index: index // 当前节目所在节目列表索引
      })
      // 跳转到播放页
      wx.navigateTo({
        url: `/pages/play/main?id=${this.albumlist[this.index].program[index].id}`
      })
    },
    createPoster() {
      /*
        生成海报
        1.用户信息
        2.是否登录
        3.跳转登录页
      */

      // 未登录
      if (!wx.getStorageSync('token') || !wx.getStorageSync('userInfo').nickName) {
        wx.navigateTo({
          url: `/pages/login/main`
        })
        return false
      }

      // 跳转到生成海报页
      wx.navigateTo({
        url: `/pages/poster/main?id=${this.albumlist[this.index].album.id}`
      })
    },
    introShow() {
      // 简介的显示、折叠
      this.introflag = !this.introflag
    }
  },
  onUnload() {
    // 生命周期函数--监听页面卸载
    // 初始化数据
    this.album = {}
    this.programs = []
  },
  onShow() {
    // 设置当前页title
    wx.setNavigationBarTitle({
      title: this.albumlist[this.index] ? this.albumlist[this.index].album.title : ''
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.albumlist[this.index].album.title,
      path: `/pages/album/main?index=${this.index}&id=${this.albumlist[this.index].album.id}`,
      imageUrl: this.albumlist[this.index].album.cover,
      success: (suc) => {
        // 成功
        console.log(suc)
      },
      fail: (err) => {
        // 转发失败
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss">
.album {
  .album-content {
    border-bottom: 20rpx solid #f5f5f5;
    /* 封面 */
    .album-cover {
      height: 400rpx;
      .content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .bg {
          width: 100%;
          height: 100%;
        }
        .info {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          bottom: 0;
          .desc {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            .cover {
              width: 210rpx;
              height: 210rpx;
              margin-top: 40rpx;
              box-shadow: 0px 4rpx 8rpx 0px rgba(22, 22, 22, 0.54);
            }
            .title {
              font-size: 28rpx;
              color: #333;
              margin-top: 36rpx;
            }
            .teacher {
              font-size: 24rpx;
              color: rgba(102, 102, 102, 0.8);
              margin-top: 16rpx;
            }
          }
        }
      }
    }
    /* 分享 */
    .album-share {
      .content {
        padding: 40rpx 0;
        border-bottom: 1px solid #f5f5f5;
        .title {
          font-size: 24rpx;
          line-height: 85rpx;
          color: #c33c49;
        }
        .button {
          font-size: 0;
          display: flex;
          justify-content: space-between;
          button {
            width: 300rpx;
            height: 76rpx;
            font-size: 30rpx;
            margin: 0;
            padding: 0;
            align-items: center;
          }
          .button-share {
            background-color: #c33c49;
            color: #fff;
            border-color: #c33c49;
            border-radius:8rpx;
          }
          .button-poster {
            background-color: #fbfafc;
            border-color: #d6d5d6;
          }
        }

      }
    }
    /* 简介 */
    .album-intro {
      padding: 25rpx 0 30rpx 0;
      border-top: 1rpx solid #f5f5f5;
      .content {
        .title {
          display: block;
          font-size: 24rpx;
          line-height: 40rpx;
          color: #333;
        }
        .intro {
          position: relative;
          padding-bottom: 56rpx;
          p {
            font-size: 30rpx;
            line-height: 60rpx;
            color: #222;
            &.active {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
          .up {
            position: absolute;
            bottom: 16rpx;
            left: 50%;
            margin-left: -13rpx;
            transform: rotate(45deg);
            width: 26rpx;
            height: 26rpx;
            border-top: 2rpx solid #ccc;
            border-left: 2rpx solid #ccc;
            overflow: hidden;
            &.active {
              transform: rotate(225deg);
            }
          }
        }
      }
    }
  }
  /*列表  */
  .album-list {
    &.play {
      padding-bottom: 128rpx;
    }
    .album-list-content {
      color: #333;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }
      &.active {
        background-color: #f9f9f9;
        .number {
          color: #c33c49;
        }
        .info {
          .title {
            color: #c33c49;
          }
        }
      }
      .number {
        flex: 0 0 120rpx;
        text-align: center;
        p {
          font-size: 36rpx;
        }
      }
      .info {
        flex: 1;
        font-size: 0;
        padding-left: 30rpx;
        &.active {
          padding-right: 100rpx;
        }
        .title {
          font-size: 30rpx;
          margin-bottom: 6rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .icon {
          width: 22rpx;
          height: 22rpx;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8rpx;
        }
        .time {
          display: inline-block;
          vertical-align: middle;
          font-size: 20rpx;
          color: #888;
        }
      }
      .state {
        flex: 0 0 100rpx;
        text-align: center;
        p {
          font-size: 30rpx;
        }
        img {
          width: 40rpx;
          height: 40rpx;
          display: inline-block;
        }
      }
    }
  }
} 
</style>
