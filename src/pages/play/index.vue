<template>
  <!--播放页  -->
  <div class="play-page">
    <!-- 背景 -->
    <div class="play-cover padding-30">
      <div class="album-bg">
        <img class='bg' :src="icon.bg" mode="aspectFill" alt="">
        <img class="cover" :src="playinfo.cover" mode="aspectFill" alt="">
      </div>
    </div>   
    <!-- 进度条 -->
    <div class="progress">
      <div class="content">
        <slider @change="sliderchange" @changing="sliderchangeing" :max="playinfo.duration" :value="timeValue" block-size="14" block-color="#c33c49" backgroundColor="#333333" activeColor="#c33c49"  />
        <div class="buffered">
          <p class="percent"></p>
        </div>
        <div class="time">
          <p class="start">{{ timeNow }}</p>
          <p class="end">{{ timeEnd }}</p>
        </div>
      </div>
    </div>
    <!-- 控制栏 播放 暂停 -->
    <div class="control flex-center">
      <div class="prev flex-center" @click="prevFn()">
        <img :src="icon.next" mode="aspectFit" alt="">
      </div>
      <div class="start">
        <img :src="icon.pauseicon" mode="aspectFit" v-if="playstatus" @click="pauseFn()" alt="">
        <img :src="icon.playicon" mode="aspectFit" v-if="!playstatus" @click="playFn()" alt="">
      </div>
      <div class="next flex-center" @click="nextFn()">
        <img :src="icon.next" mode="aspectFit" alt="">
      </div>
    </div>
    
    <!-- 评论 -->
    <div class="discuss padding-30">
      <div class="title">
        评论（{{total}}）  
      </div>
      <Comment :commentlist="commentlist"></Comment>
      <!-- 加载中 -->
      <LoadingMore :moreflag="moreflag"></LoadingMore>
    </div>
    <!-- 输入框 -->
    <div class="inputfield flex-center">
      <input :value="content" @input="onInput" @confirm="confirm" confirm-type="send" placeholder="说点什么吧" placeholder-style="color:#ccc;"/>
      <span @click="send()" class="flex-center">发送</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Comment from '@/components/comment/comment'
import LoadingMore from '@/components/loading/loading'
import { toast, formatDuration } from '@/utils'
import api from '@/utils/api'

export default {
  data() {
    return {
      icon: {
        bg: require('@/static/images/albumbg.png'),
        pauseicon: require('@/static/images/pauseicon.png'),
        playicon: require('@/static/images/playicon.png'),
        next: require('@/static/images/next.png')
      },
      timeTotal: 0, // 音频时长 单位：秒  this.playinfo.duration
      timeValue: 0, // 当前播放的音频时间 单位：秒
      timeNow: '00:00', // 当前播放的音频时间 格式：00:00
      timeEnd: '00:00', // 音频总时间 格式：00:00
      commentlist: [], // 评论列表
      total: '', // 评论总数
      content: '', // 输入的内容
      page: 1, // 第几页
      needflag: 1, // 是否上拉完成
      moreflag: 1 // 是否还有更多
    }
  },
  components: {
    Comment,
    LoadingMore
  },
  computed: {
    ...mapState({
      activeid: state => state.activeid,
      playinfo: state => state.playinfo,
      playstatus: state => state.playstatus,
      albumlist: state => state.albumlist,
      playflag: state => state.playflag,
      currenttime: state => state.currenttime,
      adflag: state => state.adflag
    })
  },
  created() {
    // 小程序本身设计是会在刚打开的时候就初始化所有的 page，
    // 所以会直接触发 created 生命周期。
  },
  mounted() {
    // 隐藏分享 当前页不可分享
    wx.hideShareMenu()
    // 设置当前页信息
    this.setInfo(this.playinfo.title)
    // 如果点击的是同一节目即id相同 或 来自底部播放栏 type === 'player'  , 不需要初始化了
    if (Number(this.activeid) === Number(this.$root.$mp.query.id) || this.$root.$mp.query.type === 'player') {
      return
    }
    // 初始化
    this.initializeComent()
    // 获取评论列表
    this.getCommentList()
  },
  watch: {
    playinfo: function(val) {
      // 监听播放信息 设置当前页title
      this.setInfo(val.title)
      // 获取评论列表
      this.getCommentPageOne()
    },
    currenttime: function(time) {
      // 监听时间变化
      this.timeNow = formatDuration(time)
      this.timeValue = Math.ceil(time)
    }
  },
  onReachBottom() {
    // 滚动到底部
    if (this.needflag !== 0) {
      this.needflag = 0
      this.getCommentList()
    }
  },
  methods: {
    ...mapActions([
      'audioNext',
      'audioPrev',
      'audioPlay',
      'audioPause',
      'audioSeek'
    ]),
    sliderchange(e) {
      // slider改变
      this.timeValue = e.target.value
      // 跳转到指定位置
      this.audioSeek(e.target.value)
    },
    sliderchangeing(e) {
      // 拖动中事件
      // console.log('拖动中事件')
      // console.log(e.target.value)
    },
    async getCommentList(val) {
      // 获取评论列表
      const list = await api.getCommentList({
        page: this.page,
        program_id: this.playinfo.id
      })
      if (!list) return
      val === 1 ? this.commentlist = list.data.list : this.commentlist = this.commentlist.concat(list.data.list)
      list.data.next === 0 ? this.moreflag = 0 : this.needflag = 1
      this.total = list.data.total
      this.page++
    },
    initializeComent() {
      // 初始化
      this.commentlist = [] // 评论列表
      this.total = '' // 评论总数
      this.content = '' // 输入的内容
      this.page = 1 // 第几页
      this.needflag = 1 // 是否上拉完成
      this.moreflag = 1 // 是否还有更多
    },
    setInfo(title) {
      // 设置当前页title
      wx.setNavigationBarTitle({
        title: title
      })
      // 音频总时间 格式：00:00
      this.timeEnd = formatDuration(this.playinfo.duration)
    },
    playFn() {
      this.audioPlay()
    },
    pauseFn() {
      this.audioPause()
    },
    async nextFn() {
      await this.audioNext()
      // 更新评论
      this.getCommentPageOne()
    },
    async prevFn() {
      await this.audioPrev()
      // 更新评论
      this.getCommentPageOne()
    },
    getCommentPageOne() {
      this.content = ''
      this.page = 1
      this.needflag = 1
      this.moreflag = 1
      this.getCommentList(1)
    },
    onInput(e) {
      this.content = e.target.value
    },
    confirm() {
      // 键盘上的发送按钮
      this.verifyFn(this.content)
    },
    send() {
      // 发送按钮
      this.verifyFn(this.content)
    },
    async verifyFn(content) {
      /*
        发表评论验证
        1. 是否登录
        2. 字段验证
      */
      // 未登录
      if (!wx.getStorageSync('token')) {
        toast('请先登录后重试')
        wx.navigateTo({
          url: `/pages/login/main`
        })
        return
      }
      // 验证
      if (content.length === 0 || content.match(/^\s+$/g)) {
        toast('输入为空，或都是空格')
        return
      }
      // 获取评论列表
      const result = await api.createComment({
        content: content,
        program_id: this.playinfo.id
      })
      if (result.code === 200) {
        toast('发表成功')
        this.getCommentPageOne()
      }
    }
  }
}
</script>

<style lang="scss">
img {
  width: 100%;
  height: 100%;
}
.play-page {
  .play-cover {
    height: 364rpx;
    .album-bg {
      width: 100%;
      height: 100%;
      position: relative;
      .bg {
        width: 100%;
        height: 100%;
      }
      .cover {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
        width: 210rpx;
        height: 210rpx;
        box-shadow: 0px 4rpx 8rpx 0px rgba(22, 22, 22, 0.54);
      }
    }
  }
  .progress {
    // display: none;
    padding: 30rpx 30rpx 0 30rpx;
    .content {
      position: relative;
      slider {
        margin: 0;
      }
      .buffered {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 36rpx;
        p {
          height: 6rpx;
          background-color:#f3f3f3;
          margin-top: 14rpx;
          border-radius: 8rpx;
        }
      }
      .time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40rpx;
        p {
          color: #333;
          font-size: 24rpx;
        }
      }
    }
  }
  .control {
    padding: 20rpx 116rpx 20rpx 116rpx;
    height: 110rpx;
    border-bottom: 1rpx solid #f3f4f5;
    .prev,.next {
      flex:  0 0 130rpx;
      height: 110rpx;
      img {
        width: 34rpx;
        height: 34rpx; 
      }
    }
    .prev img {
      transform: rotate(180deg);
    }
    .start {
      flex: 1;
      height: 110rpx;
      img {
        
      }
    }
  }
  .discuss {
    padding-bottom: 136rpx;
    .title {
      padding-left:18rpx;
      color: #333;
      font-size: 28rpx;
      height: 80rpx;
      line-height: 80rpx;
      border-bottom: 1rpx solid #f3f3f3;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0,-50%);
        width: 4rpx;
        height: 32rpx;
        background-color: #c33c49;
      } 
    }
  }
  .inputfield {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0 30rpx;
		background-color: #fff;
    box-shadow: 0 -1rpx 10rpx 0 #eeeeee;
		input {
      margin: 38rpx 15rpx 38rpx 38rpx;
			flex: 1;
			height: 60rpx;
			line-height: 60rpx;
			background-color: #eeeeee;
			border-radius: 8rpx;
			font-size: 30rpx;
      color: #333;
      padding-left: 30rpx;
		}
    span {
      flex: 0 0 106rpx;
      height: 60rpx;
      background-color: #c33c49;
      border-radius: 8rpx;
      color: #fff;
      font-size: 28rpx;
    }
  }
}

</style>
