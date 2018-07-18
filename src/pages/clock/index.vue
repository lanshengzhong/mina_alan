<template>
  <!--打卡排行榜  -->
  <div class="clock">
    <!-- 绘制图片 -->
    <div class="canvas">
      <canvas canvas-id='clockCanvas' :class="{'canvasactive': canvasflag}" style="opacity:0!important;width: 325px;height: 413px;margin-bottom:20px;" width="650px" height="413px"></canvas>
    </div>
    <!-- 信息 -->
    <div class="desc">
      <img class='bg' :src="icon.bg" mode="aspectFill" alt="">
      <div class="info">
        <div class="content">
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
          <button class="share flex-center" open-type="share">告诉朋友</button>
          <p class="save flex-center" @click="savePoster()">保存图片分享朋友圈</p>
        </div>
      </div>
    </div>
    <!-- 排行榜 -->
    <div class="ranking">
      <p class="title">勤学榜({{month}}月)</p>
      <p class="time">早4点至晚23点</p>
      <div class="content">
        <div class="list" v-for="(rank,index) in ranklist" :key="index"> 
          <img class='front' :src="icon.first" mode="aspectFill" v-if="index === 0" alt="">
          <img class='front' :src="icon.second" mode="aspectFill" v-if="index === 1" alt="">
          <img class='front' :src="icon.third" mode="aspectFill" v-if="index === 2" alt="">
          <p class='front' v-if="index > 2">{{index+1}}</p>
          <img class='head' :src="rank.avatar" mode="aspectFill" alt="">
          <p class="name" :user-id="rank.member_id">{{rank.nickname}}</p>
          <p class="num">{{rank.count}}天</p>
        </div>
      </div>
    </div>
    <!-- 加载中 -->
    <LoadingMore :moreflag="moreflag"></LoadingMore>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import api from '@/utils/api'
import config from '@/utils/config'
import LoadingMore from '@/components/loading/loading'
import { numberSwitch, showLoading, hideLoading, toast } from '@/utils'

export default {
  data() {
    return {
      canvasflag: 0, // 隐藏canvas
      month: new Date().getMonth() + 1, // 当前月份
      clockinfo: {}, // 打卡信息
      ranklist: [], // 排行榜数据
      page: 1, // 第几页
      needflag: 1, // 是否上拉完成
      moreflag: 1, // 是否还有更多
      icon: {
        first: require('@/static/images/1.png'),
        second: require('@/static/images/2.png'),
        third: require('@/static/images/3.png'),
        bg: require('@/static/images/clockbg.png')
      }
    }
  },
  components: {
    LoadingMore
  },
  computed: {
    ...mapState({
      clockflag: state => state.clockflag,
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
    // 初始化数据
    this.initData()
    // 打卡信息 传递过来的
    this.clockinfo = this.$root.$mp.query
    this.clockinfo.month_total = numberSwitch(Number(this.clockinfo.month_total))
    this.clockinfo.today_rank = numberSwitch(Number(this.clockinfo.today_rank))
    this.clockinfo.month_rank = numberSwitch(Number(this.clockinfo.month_rank))
    // 生成海报
    // this.saveClock()
    // 排行榜
    this.getClockList()
    // 如果是当天第一次打卡 进来已经打卡成功再请求一次打卡flag
    if (!this.clockflag) {
      this.getClockFlag()
    }
  },
  onReachBottom() {
    // 滚动到底部
    if (this.needflag !== 0) {
      this.needflag = 0
      this.getClockList()
    }
  },
  methods: {
    ...mapActions([
      'getClockFlag'
    ]),
    initData() {
      this.canvasflag = 0 // 隐藏canvas
      this.page = 1 // 第几页
      this.needflag = 1 // 是否上拉完成
      this.moreflag = 1 // 是否还有更多
      this.month = new Date().getMonth() + 1 // 当前月份
      this.clockinfo = {} // 打卡信息
      this.ranklist = [] // 排行榜数据
    },
    saveClock() {
      // 保存图片 canvas绘制
      showLoading('正在生成海报...')
      // 下载头像
      wx.downloadFile({
        url: this.clockinfo.avatar,
        success: (res) => {
          if (res.statusCode === 200) {
            this.createPoster(res.tempFilePath)
          }
        },
        fail: (res) => {
          // 隐藏loading
          hideLoading()
          toast('头像下载失败，请稍后重试')
          console.log(res)
        }
      })
    },
    createPoster(img) {
      // 生成海报
      // 使用 wx.createCotntext 获取绘图上下文 context
      let ctx = wx.createCanvasContext('clockCanvas')

      // 画背景
      ctx.drawImage(require('@/static/images/clockbg.png'), 0, 0, 325, 413)

      // 画白色矩形
      ctx.rect(0, 315, 325, 98)
      ctx.setFillStyle('white')
      ctx.setLineWidth(1)
      ctx.fill()

      // 画头像
      circleImg(110, 30, 50)

      // 画二维码
      ctx.drawImage(require('@/static/images/code.jpg'), 219, 325, 82, 82)

      // 绘制文字
      drawText(18, '#333333', '今日第', 72, 155)
      drawText(18, '#333333', '位打卡', 194, 155)
      drawText(15, '#c33c49', '长按识别，和我一起听', 20, 342)
      drawText(12, '#000000', '本音频由红枣FM提供', 20, 365)
      drawText(9, '#000000', '最大的中医音频学习APP', 20, 382)

      // 今日第几位
      drawText(22, '#c33c49', this.clockinfo.today_rank, 159, 155, 'center')
      // 本月学习
      drawText(16, '#c33c49', `${this.clockinfo.month_total}天`, 64, 226, 'center')
      // 累计学习
      drawText(16, '#c33c49', `${this.clockinfo.total}天`, 162, 226, 'center')
      // 本月排名
      drawText(16, '#c33c49', `${this.clockinfo.month_rank}名`, 262, 226, 'center')

      drawText(15, '#333333', '本月学习', 64, 250, 'center')
      drawText(15, '#333333', '累计学习', 162, 250, 'center')
      drawText(15, '#333333', '本月排名', 262, 250, 'center')

      // 竖线
      drawLine(112, 220, 112, 257)
      drawLine(212, 220, 212, 257)
      drawLine(8, 10, 8, 295)
      drawLine(317, 10, 317, 295)
      drawLine(8, 10, 317, 10)
      drawLine(8, 295, 317, 295)
      // 绘制
      ctx.draw()

      // 画圆的方法
      function circleImg(x, y, r) {
        ctx.save()
        ctx.beginPath()
        var d = 2 * r
        var cx = x + r
        var cy = y + r
        ctx.arc(cx, cy, r, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(img, x, y, d, d)
        ctx.closePath()
        ctx.restore()
      }
      function drawText(font, color, text, x, y, align = 'normal') {
        ctx.setTextAlign(align)
        ctx.setTextBaseline('middle')
        ctx.setFontSize(font)
        ctx.setFillStyle(color)
        ctx.fillText(text, x, y)
      }
      // 竖线
      function drawLine(x, y, xx, yy) {
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#b5b1b1')
        ctx.moveTo(x, y)
        ctx.lineTo(xx, yy)
        ctx.stroke()
      }

      // 边框
      // ctx.rect(10, 8, 307, 298)
      // ctx.setStrokeStyle('#b5b1b1')
      // ctx.setGlobalAlpha(0)
      // ctx.fill()
    },
    savePoster() {
      this.saveClock()
      // 保存海报
      setTimeout(() => {
        // 隐藏loading
        wx.hideLoading()
        wx.canvasToTempFilePath({
          canvasId: 'clockCanvas',
          success: (res) => {
            // 绘制完成隐藏canvas
            this.canvasflag = 1
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showModal({
                  title: '保存成功',
                  content: '海报已保存至相册，快去发个朋友圈',
                  showCancel: false,
                  success: (suc) => {
                    if (suc.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                })
              },
              fail: () => {
                wx.getSetting({
                  success: (res) => {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                      toast('保存失败,请授权保存图片到手机')
                      // 重新获取保存图片权限
                      wx.openSetting({
                        success: (res) => {
                        // 再次获取登录
                          if (res.authSetting['scope.writePhotosAlbum']) {
                            this.savePoster()
                          }
                        },
                        fail: (err) => {
                          console.log(err)
                        }
                      })
                    } else {
                      toast('用户取消')
                    }
                  }
                })
              }
            })
          }
        })
      }, 2000)
    },
    async getClockList(val) {
      // 排行榜
      const list = await api.getClockList({
        page: this.page
      })
      if (!list) return
      val === 1 ? this.ranklist = list.data.list : this.ranklist = this.ranklist.concat(list.data.list)
      list.data.next === 0 ? this.moreflag = 0 : this.needflag = 1
      this.page++
    }
  },
  onShareAppMessage(res) {
    // 分享
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: `我在${config.title}小程序学习了${this.clockinfo.total}天，你呢？`,
      path: `/pages/clockshare/main?avatar=${this.clockinfo.avatar}&month_rank=${this.clockinfo.month_rank}&month_total=${this.clockinfo.month_total}&today_rank=${this.clockinfo.today_rank}&total=${this.clockinfo.total}`,
      imageUrl: '',
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
canvas {
  box-shadow: 0px 4px 8px 0 rgba(135, 135, 135, 0.4);
  border-radius: 10rpx;
  position: absolute;
  z-index: -1 !important;
}
.canvas {
  position: absolute;
  z-index: -1 !important;
}
.canvasactive {
  display: none;
}
.clock {
  padding: 40rpx 50rpx 0 50rpx;
  .desc {
    position: relative;
    box-shadow: 0px 4px 8px 0 rgba(135, 135, 135, 0.4);
	  border-radius: 5px;
    font-size: 0;
    img {
      width: 100%;
      height: 876rpx;
    }
    .info {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      .content {
        position: absolute;
        left: 16rpx;
        right: 16rpx;
        top: 22rpx;
        bottom: 22rpx;
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
  }
  .ranking {
    margin-top: 60rpx;
    background-color: #f2f2f2;
    box-shadow: 0 8rpx 16rpx 0 rgba(135, 135, 135, 0.4);
    border-radius: 10rpx;
    .title {
      padding-top: 36rpx;
      text-align: center;
      font-size: 40rpx;
      color: #c33c49;
    }
    .time {
      padding: 20rpx 0;
      text-align: center;
      font-size: 28rpx;
      color: #333;
    }
    .content {
      .list {
        display: flex;
        align-items: center;
        height: 164rpx;
        font-size: 30rpx;
        color: #333;
        
        .front {
          flex: 0 0 45rpx;
          height: 58rpx;
          padding: 0 28rpx;
          text-align: center;
          font-size: 48rpx;
          color: #888;
        }
        .head {
          flex: 0 0 100rpx;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          margin-left: 10rpx;
          margin-right: 30rpx;
        }
        .name {
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .num {
          padding: 0 30rpx;
          color: #c33c49;
        }
      }
    }
  }
}
</style>
