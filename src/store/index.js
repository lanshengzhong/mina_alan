import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

// 使用状态管理
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    audioManager: wx.getBackgroundAudioManager(), // 获取背景播放audio实例
    playflag: 0, // 是否显示底部播放栏
    playstatus: 0, // 播放状态 0 暂停 1播放
    playinfo: {}, // 当前的播放信息
    albumlist: [], // 所有的专辑列表信息
    programlist: [], // 正在播放的节目列表
    activeid: 0, // 正在播放的节目id
    isbought: 0, // 当前播放的是否购买 用于底部播放栏
    currenttime: 0, // 当前播放时长,
    adflag: 0, // 是否开启广告。加群 等  统一开关
    clockflag: 0, // 是否打卡
    jumpflag: 0, // 是否是小程序间的跳转
    userinfo: {} // 用户信息
  },
  actions,
  mutations
})

export default store
