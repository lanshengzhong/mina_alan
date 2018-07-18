import * as types from './mutation-types'

const matutaions = {
  // 用户信息
  [types.SET_USER_INFO](state, userinfo) {
    state.userinfo = userinfo
  },
  // 是否购买
  [types.SET_ISBOUGHT](state, isbought) {
    state.isbought = isbought
  },
  // 专辑列表
  [types.SET_ALBUM_LIST](state, albumlist) {
    state.albumlist = albumlist
  },
  // 节目列表
  [types.SET_PROGRAM_LIST](state, programlist) {
    state.programlist = programlist
  },
  // 是否播放
  [types.SET_PLAY_FLAG](state, playflag) {
    state.playflag = playflag
  },
  // 高亮的节目id
  [types.SET_ACTIVE_ID](state, activeid) {
    state.activeid = activeid
  },
  // 播放状态
  [types.SET_PLAY_STATUS](state, playstatus) {
    state.playstatus = playstatus
  },
  // 播放信息
  [types.SET_PLAY_INFO](state, playinfo) {
    state.playinfo = playinfo
  },
  // 当前播放时间
  [types.SET_CURRENT_TIME](state, currenttime) {
    state.currenttime = currenttime
  },
  // 广告开关
  setAdFlag(state, adflag) {
    state.adflag = adflag
  },
  // 是否打卡
  setClockFlag(state, clockflag) {
    state.clockflag = clockflag
  },
  // 音频播放信息
  setAudioInfo(state) {
    // 设置背景播放信息
    state.audioManager.src = state.playinfo.audio
    state.audioManager.title = state.playinfo.title
    state.audioManager.coverImgUrl = state.playinfo.cover
    state.audioManager.epname = state.programlist.album.title
    state.audioManager.singer = state.programlist.teacher
  },
  // 是否是小程序之间的跳转
  setJumpFlag(state, jumpflag) {
    state.jumpflag = jumpflag
  }
}

export default matutaions
