<template>
  <!--生成海报页  -->
  <div class="poster">
    <canvas canvas-id='myCanvas' style=" width: 325px;height: 475px;" width="650px" height="950px"></canvas>
    <div class="button">
      <p class="flex-center" @click="savePoster()">保存海报到手机</p>
      <button class='flex-center' open-type="openSetting" v-if="settingflag">打开授权页面</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { toast } from '@/utils'

export default {
  data() {
    return {
      firstflag: 0, // 用户是否触发保存图片操作
      settingflag: 0 // 是否显示打开授权页按钮
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
  onShow() {
    if (this.firstflag) {
      // 显示的时候去获取授权 (保存图片到相册)
      wx.getSetting({
        success: (res) => {
        // api改动无法自动打开授权页  显示授权按钮
          if (!res.authSetting['scope.writePhotosAlbum']) {
            this.settingflag = 1
          } else {
            this.settingflag = 0
          }
        }
      })
    }
  },
  mounted() {
    // 隐藏分享 当前页不可分享
    wx.hideShareMenu()
    // loading
    wx.showLoading({
      title: '正在生成海报...'
    })
    // 生成图片
    wx.downloadFile({
      url: this.userinfo.avatarUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          this.createPoster(res.tempFilePath)
        }
      },
      fail: (res) => {
        console.log(res)
        // 隐藏loading
        wx.hideLoading()
        toast('头像下载失败，请稍后重试')
      }
    })
  },
  methods: {
    createPoster(img) {
      // 生成海报
      // 使用 wx.createCanvasContext 获取绘图上下文 ctx
      const ctx = wx.createCanvasContext('myCanvas')
      // 画背景
      ctx.drawImage(require('@/static/images/poster.png'), 0, 0, 325, 475)
      // 画二维码
      ctx.drawImage(require('@/static/images/code.jpg'), 218, 380, 82, 82)

      // 画头像 38  38/2 = 19  256 422
      ctx.save()
      ctx.beginPath()
      ctx.arc(259, 421, 19, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(img, 259 - 19, 421 - 19, 38, 38)
      ctx.closePath()
      ctx.restore()

      // 画专辑封面
      ctx.save()
      ctx.beginPath()
      ctx.arc(164, 270, 76, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(require(`@/static/images/share/${Number(this.$root.$mp.query.id)}.jpg`), 164 - 76, 270 - 76, 152, 152)
      ctx.closePath()
      ctx.restore()
      // 绘制
      ctx.draw()
      // 隐藏loading
      wx.hideLoading()
    },
    savePoster() {
      // 用户触发了保存图片
      this.firstflag = 1
      // 保存海报
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: (res) => {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showModal({
                title: '保存成功',
                content: '海报已保存至相册，快去发个朋友圈',
                showCancel: false,
                success: function(suc) {
                  if (suc.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            },
            fail: () => {
              wx.getSetting({
                success: (res) => {
                  // 无法自动打开授权页  显示授权按钮
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    toast('保存失败,请授权保存图片到手机')
                    this.settingflag = 1
                  } else {
                    toast('用户取消')
                  }
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.poster {
  padding-top: 20px;
  canvas {
    box-shadow: 0px 4px 8px 0#878787;
	  border-radius: 5px;
    margin:0 auto;
  }
  .button {
    position: relative;
    margin-top:60rpx;
    text-align: center;
    p,button {
      width: 400rpx;
      height: 76rpx;
      border-radius: 8rpx;
      background-color: #c33c49;
      box-shadow: 0 8rpx 16rpx 0 #dadada;
      font-size: 32rpx;
      color: #ffffff;
      margin: 0 auto;
    }
    button {
      width: 440rpx;
      height: 100rpx;
      position: absolute;
      transform: translateX(-50%);
      top: -10rpx;
      left: 50%;
      z-index: 9;
      opacity: 0;
    }
  }
}
</style>
